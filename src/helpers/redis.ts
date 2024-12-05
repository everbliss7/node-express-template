export function parseRedisInfo(infoString: string): Record<string, Record<string, string | number>> {
   const sections: Record<string, Record<string, string | number>> = {};
   let currentSection = '';
 
   // Split the string into lines and process each line
   const lines = infoString.split('\n');
 
   for (const line of lines) {
     // Skip empty lines and comments
     if (!line.trim() || line.startsWith('#')) {
       if (line.startsWith('# ')) {
         // Extract section name (removing '# ' prefix)
         currentSection = line.slice(2).toLowerCase();
         sections[currentSection] = {};
       }
       continue;
     }
 
     // Split each line into key-value pairs
     const [key, value] = line.split(':');
     
     if (key && value) {
       // Try to parse numeric values
       const numericValue = parseFloat(value);
       const processedValue = !isNaN(numericValue) ? numericValue : value;
 
       // Add to the current section
       if (currentSection) {
         sections[currentSection][key.trim()] = processedValue;
       }
     }
   }
 
   return sections;
 }
 

 export function normalizeRedisInfo(infoString: string): string {
   const parsedInfo = parseRedisInfo(infoString);
   return JSON.stringify(parsedInfo, null, 2);
 }