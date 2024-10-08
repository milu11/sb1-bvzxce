import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface InventoryItem {
  code: string;
  description: string;
  pub: string;
  estack: string;
  stock: string;
  uxcTamano: string;
  stockCajas: string;
  pvpPrecio: string;
  stockValorE: string;
}

export async function extractDataFromImage(image: File): Promise<InventoryItem[]> {
  try {
    const base64Image = await fileToBase64(image);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Extract inventory data from this image. Return the data as a JSON array of objects with the following properties: code, description, pub, estack, stock, uxcTamano, stockCajas, pvpPrecio, stockValorE. Ensure all values are strings." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const content = response.choices[0].message.content;
    if (content) {
      return JSON.parse(content) as InventoryItem[];
    } else {
      throw new Error("No content in the response");
    }
  } catch (error) {
    console.error("Error extracting data from image:", error);
    throw error;
  }
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to convert file to base64'));
      }
    };
    reader.onerror = error => reject(error);
  });
}