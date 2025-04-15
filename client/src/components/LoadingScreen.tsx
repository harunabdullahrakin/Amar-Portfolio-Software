import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConfigType } from '@/types';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const { data: config } = useQuery<ConfigType>({
    queryKey: ["/api/config"],
    staleTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    // Simulate loading for at least 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // When loading is complete, fade out and hide the component
  if (!isLoading) {
    return null;
  }

  const name = config?.profile?.name || 'Loading...';
  // Get the loading letter from config, fallback to first letter of name, or 'H' as default
  const loadingLetter = config?.ownerSettings?.loadingLetter || name.charAt(0) || 'H';
  // Get the loading text from config, or fall back to default
  const loadingText = config?.ownerSettings?.loadingText || 'Loading...';

  // Different SVG paths for different letters
  const svgPaths: Record<string, string> = {
    'H': "m466 512h-128.498v-210.877h-163.003v210.877h-128.499v-512h128.499v189.922h163.003v-189.922h128.498zm-98.498-30h68.498v-452h-68.498v189.922h-223.003v-189.922h-68.499v452h68.499v-210.877h223.003z",
    'A': "M256 0L0 512h64l54.4-128h266.4L439.2 512h64L256 0zm0 73.43L394.46 336H117.54L256 73.43z",
    'B': "M128 0v512h160c70.4 0 128-57.6 128-128 0-38.4-16-73.6-44.8-96 28.8-25.6 44.8-60.8 44.8-96 0-70.4-57.6-128-128-128H128zm64 64h96c32 0 64 32 64 64s-32 64-64 64H192V64zm0 192h96c32 0 64 32 64 64s-32 64-64 64H192V256z",
    'C': "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256c74.6 0 145.1-32.3 193.6-88.6l-45.3-45.3c-37.4 44.8-93.1 70.9-148.3 70.9-106 0-192-86-192-192s86-192 192-192c55.2 0 110.9 26.1 148.3 70.9l45.3-45.3C401.1 32.3 330.6 0 256 0z",
    'D': "M128 0v512h160c106.4 0 192-85.6 192-192V192c0-106.4-85.6-192-192-192H128zm64 64h96c70.4 0 128 57.6 128 128v128c0 70.4-57.6 128-128 128H192V64z",
    'E': "M128 0v512h320v-64H192v-160h192v-64H192V64h256V0H128z",
    'F': "M128 0v512h64V288h192v-64H192V64h256V0H128z",
    'G': "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256c74.6 0 145.1-32.3 193.6-88.6l-45.3-45.3c-37.4 44.8-93.1 70.9-148.3 70.9-106 0-192-86-192-192s86-192 192-192c47.6 0 93.9 16.9 130.1 47.5L448 112v-16C398.5 36.8 329.3 0 256 0z",
    'I': "M224 0v512h64V0h-64z",
    'J': "M352 0v384c0 32-32 64-64 64s-64-32-64-64H160c0 70.4 57.6 128 128 128s128-57.6 128-128V0h-64z",
    'K': "M128 0v512h64V288l224 224h96L288 288 512 64h-96L192 224V0h-64z",
    'L': "M128 0v512h320v-64H192V0h-64z",
    'M': "M128 0v512h64V169.6L320 384l128-214.4V512h64V0h-64L320 256 192 0h-64z",
    'N': "M128 0v512h64V107.2L448 512h64V0h-64v404.8L192 0h-64z",
    'O': "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 448c-106 0-192-86-192-192S150 64 256 64s192 86 192 192-86 192-192 192z",
    'P': "M128 0v512h64V256h160c70.4 0 128-57.6 128-128S422.4 0 352 0H128zm64 64h160c32 0 64 32 64 64s-32 64-64 64H192V64z",
    'Q': "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256c49.5 0 97.5-14.1 138.6-40.8l71.4 71.4 45.3-45.3-71.4-71.4C466 383.5 512 322.4 512 256c0-141.4-114.6-256-256-256zm0 448c-106 0-192-86-192-192S150 64 256 64s192 86 192 192-86 192-192 192z",
    'R': "M128 0v512h64V288h117.6L448 512h76.8L371.2 288c44.8-22.4 76.8-64 76.8-128C448 67.2 380.8 0 288 0H128zm64 64h96c53.7 0 96 42.3 96 96s-42.3 96-96 96H192V64z",
    'S': "M256 0C114.6 0 0 114.6 0 256h64c0-106 86-192 192-192s192 86 192 192-86 192-192 192c-38.4 0-73.6-16-96-44.8L96 448h160c141.4 0 256-114.6 256-256S397.4 0 256 0z",
    'T': "M224 64v448h64V64h160V0H64v64h160z",
    'U': "M128 0v320c0 70.4 57.6 128 128 128s128-57.6 128-128V0h-64v320c0 32-32 64-64 64s-64-32-64-64V0h-64z",
    'V': "M256 0L128 512h64l86.4-384 86.4 384h64L256 0z",
    'W': "M128 0L64 512h64l32-256 96 192 96-192 32 256h64L384 0h-64L256 192 192 0h-64z",
    'X': "M128 0L0 128l192 128L0 384l128 128 128-192 128 192 128-128-192-128 192-128L384 0 256 192 128 0z",
    'Y': "M256 256v256h64V256l192-256h-76.8L320 170.4 204.8 0H128l128 256z",
    'Z': "M64 0v64l284.8 341.6H64V448h384v-64L163.2 43.2H448V0H64z"
  };

  // Create the SVG path for the letter (uppercase)
  const letterKey = loadingLetter.toUpperCase();
  const svgPath = svgPaths[letterKey] || svgPaths['H']; // Default to H if the letter is not supported

  return (
    <div className="loading-page">
      {/* SVG letter initial */}
      <svg id="svg" enableBackground="new 0 0 512 512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <g>
          <path d={svgPath}/>
        </g>
      </svg>

      <div className="name-container">
        <div className="logo-name">{loadingText}</div>
      </div>
    </div>
  );
}