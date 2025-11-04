import Image from "next/image";
type ProductItem = {
  category: string;
  url: string;
  item_name: string;
};

interface ImageResultProps {
  imageUrl: string | null;
  prompt: string;
  products?: ProductItem[];
}

export default function ImageResult({ imageUrl, prompt, products = [] }: ImageResultProps) {
  if (!imageUrl) return null;

  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    const exists = acc[product.category].some(
      (p) => p.item_name.toLowerCase() === product.item_name.toLowerCase()
    );

    if (!exists) {
      acc[product.category].push(product);
    }

    return acc;
  }, {} as Record<string, ProductItem[]>)

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-xl p-4 h-full flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Generated Room</h2>
          <div className="w-full rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
            <Image
              src={imageUrl}
              width={4000}
              height={4000}
              alt="Generated Room"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-between pt-4">
            <p className="text-bas text-gray-500 mt-3">
              ผลลัพธ์จาก Prompt: “{prompt}”
            </p>
            <button
              onClick={() => window.location.reload()}
              className="py-2 px-6 rounded-xl font-semibold transition-all duration-300 shadow-md text-white bg-gradient-to-r from-blue-500 to-blue-500 hover:shadow-lg hover:from-blue-500 hover:to-blue-600 hover:scale-105"
            >
              Re-Generated
            </button>
          </div>
          
        </div>
      </div>

      <div className="w-full lg:w-90 bg-white rounded-2xl shadow-xl p-6 h-fit">
        <h3 className="text-2xl font-semibold text-gray-900 mb-5">สินค้าแนะนำตาม Category</h3>

        {Object.keys(productsByCategory).length > 0 ? (
          <div className="space-y-5 max-h-[520px] overflow-y-auto pr-2">
            {Object.entries(productsByCategory).map(([category, items]) => (
              <div key={category}>
                <p className="text-xl font-semibold text-gray-700 mb-1 capitalize">
                  {category}
                </p>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <a
                      key={index}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block border border-gray-100 rounded-lg px-3 py-2 hover:border-blue-500 hover:bg-blue-50/40 transition-all"
                    >
                      <p className="text-lg font-medium text-gray-900">{item.item_name}</p>
                      <p className="text-base text-blue-500">ดูรายละเอียด →</p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
            ไม่พบข้อมูลสินค้า
          </div>
        )}
      </div>
    </div>
  );
}
