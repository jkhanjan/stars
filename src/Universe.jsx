import { useEffect, useRef, useState, useMemo } from "react";

const Universe = ({ starDensity = 1.0, starSpeed = 0.5 }) => {
  const canvasRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const timeRef = useRef(0);
  const nonDirectionalTimeRef = useRef(0); // New time reference for non-directional movement
  const stretchFactorRef = useRef(0); // Changed from 0.1 to 0 for no stretch when not hovering
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(0);
  const glRef = useRef(null);
  const programInfoRef = useRef(null);

  const vertexShaderSource = useMemo(
    () => `
    attribute vec2 aVertexPosition;
    void main() {
      gl_Position = vec4(aVertexPosition, 0.0, 1.0);
    }
  `,
    []
  );

  const fragmentShaderSource = useMemo(
    () => `
    precision highp float;
    uniform float iTime;
    uniform float iNonDirectionalTime;  
    uniform vec2 iResolution;
    uniform sampler2D iChannel0;
    uniform float stretchFactor;
    uniform bool isHovered;

    const float tau = 10.28318530717958647692;
    #define GAMMA (2.2)
    
    vec3 ToLinear(in vec3 col) {
      return pow(col, vec3(GAMMA));
    }
    
    vec3 ToGamma(in vec3 col) {
      return pow(col, vec3(1.0/GAMMA));
    }
    
    vec4 Noise(in vec2 x) {
      return texture2D(iChannel0, (floor(x)+0.5)/256.0);
    }
    
    void main() {
      vec2 fragCoord = gl_FragCoord.xy;
      vec3 ray;
      ray.xy = 1.0*(fragCoord.xy-iResolution.xy*.5)/iResolution.x;
      ray.z = 1.0;
   
      float effectiveOffset;
      float speedMultiplier;
      
      if (isHovered) {
        effectiveOffset = iTime;
        speedMultiplier = mix(0.2, 0.5, stretchFactor);
      } else {
        effectiveOffset = sin(iNonDirectionalTime * 0.3) * 0.5 + 
                         cos(iNonDirectionalTime * 0.17) * 0.1;
        speedMultiplier = 0.0; 
      }

      float offset = effectiveOffset * stretchFactor * (isHovered ? 1.0 : 0.0); // Changed to 0.0 for no stretch
      float speed2 = (cos(offset)+1.0) * speedMultiplier;
      float speed = mix(0.5, 3.0, stretchFactor);
      
      offset *= 3.0;
      
      vec3 col = vec3(0);
      
      vec3 stp = ray/max(abs(ray.x),abs(ray.y));
      
      vec3 pos = 3.0*stp+.5;
      for (int i=0; i < 16; i++) {
        float z = Noise(pos.xy).x;
        // Add slight wobble when not hovered for more natural star movement
        if (!isHovered) {
          z += sin(iNonDirectionalTime * 0.1 + pos.x * 2.0) * 0.01 * float(i) / 16.0;
        }
        z = fract(z-offset);
        float d = 70.0*z-pos.z;
        float w = pow(max(0.0,1.0-8.0*length(fract(pos.xy)-.5)),2.0);
        vec3 c = max(vec3(0),vec3(1.0-abs(d+speed2*.5)/speed,1.0-abs(d)/speed,1.0-abs(d-speed2*.5)/speed));
        col += 1.5*(1.0-z)*c*w;
        pos += stp;
      }
      
      gl_FragColor = vec4(ToGamma(col),1.0);
    }
  `,
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      powerPreference: "high-performance",
      antialias: false,
    });

    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    glRef.current = gl;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(
        "Vertex shader compilation failed:",
        gl.getShaderInfoLog(vertexShader)
      );
      return;
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        "Fragment shader compilation failed:",
        gl.getShaderInfoLog(fragmentShader)
      );
      return;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error(
        "Shader program linking failed:",
        gl.getProgramInfoLog(shaderProgram)
      );
      return;
    }

    // Create noise texture
    const noiseTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, noiseTexture);

    const noiseSize = 256;
    const noiseData = new Uint8Array(noiseSize * noiseSize * 4);

    for (let y = 0; y < noiseSize; y++) {
      for (let x = 0; x < noiseSize; x++) {
        const idx = (y * noiseSize + x) * 4;

        const seed = x * 374761393 + y * 668265263;
        let rand = seed ^ (seed >> 10);
        rand = (rand * 1274126177) & 0xffffffff;
        const noise = ((rand & 0xffff) / 0xffff) * 255;

        noiseData[idx] = noise;
        noiseData[idx + 1] = noise;
        noiseData[idx + 2] = noise;
        noiseData[idx + 3] = 255;
      }
    }

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      noiseSize,
      noiseSize,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      noiseData
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

    // Create vertex buffer
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    const vertices = new Float32Array([
      -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0,
    ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Store program info for render loop
    programInfoRef.current = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      },
      uniformLocations: {
        time: gl.getUniformLocation(shaderProgram, "iTime"),
        nonDirectionalTime: gl.getUniformLocation(
          shaderProgram,
          "iNonDirectionalTime"
        ),
        resolution: gl.getUniformLocation(shaderProgram, "iResolution"),
        channel0: gl.getUniformLocation(shaderProgram, "iChannel0"),
        stretchFactor: gl.getUniformLocation(shaderProgram, "stretchFactor"),
        isHovered: gl.getUniformLocation(shaderProgram, "isHovered"),
      },
      buffers: {
        vertex: vertexBuffer,
      },
      textures: {
        noise: noiseTexture,
      },
    };

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      gl.deleteProgram(shaderProgram);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteTexture(noiseTexture);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    if (!glRef.current || !programInfoRef.current) return;

    const gl = glRef.current;
    const programInfo = programInfoRef.current;

    const animate = () => {
      const currentTime = performance.now() * 0.001;
      const deltaTime = lastTimeRef.current
        ? currentTime - lastTimeRef.current
        : 0;
      lastTimeRef.current = currentTime;

      // Update directional time only when hovering
      if (isHovered) {
        const speedFactor = starSpeed;
        timeRef.current += deltaTime * speedFactor;
      }

      // Always update non-directional time for subtle random movement
      nonDirectionalTimeRef.current += deltaTime * 0.95;

      // Update stretch factor with smooth transitions
      if (isHovered) {
        stretchFactorRef.current += (1.0 - stretchFactorRef.current) * 0.5;
      } else {
        stretchFactorRef.current += (0.0 - stretchFactorRef.current) * 0.05;
      }

      // Clear screen
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Use shader program
      gl.useProgram(programInfo.program);

      // Set uniforms
      gl.uniform1f(programInfo.uniformLocations.time, timeRef.current);
      gl.uniform1f(
        programInfo.uniformLocations.nonDirectionalTime,
        nonDirectionalTimeRef.current
      );
      gl.uniform2f(
        programInfo.uniformLocations.resolution,
        canvasRef.current.width,
        canvasRef.current.height
      );
      gl.uniform1f(
        programInfo.uniformLocations.stretchFactor,
        stretchFactorRef.current
      );
      gl.uniform1i(programInfo.uniformLocations.isHovered, isHovered ? 1 : 0);

      // Set texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, programInfo.textures.noise);
      gl.uniform1i(programInfo.uniformLocations.channel0, 0);

      // Set attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers.vertex);
      gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        2,
        gl.FLOAT,
        false,
        0,
        0
      );
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [starSpeed, isHovered]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <button
        className="absolute inset-0 m-auto bg-transparent text-white text-xs opacity-30 border border-white px-6 py-3 rounded hover:opacity-100 hover:bg-black hover:border-blue-400 hover:text-blue-400 transition-all duration-300"
        style={{ width: "fit-content", height: "fit-content" }}
        onMouseEnter={() => {
          setIsHovered(true);
          timeRef.current = 0; 
        }}
        onMouseLeave={() => setIsHovered(false)}
      >
        Hover to Activate Star Streaking
      </button>
    </div>
  );
};

export default Universe;