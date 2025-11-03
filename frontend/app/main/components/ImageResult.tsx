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
        <div className="bg-white rounded-2xl shadow-md p-4 h-full flex flex-col">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Generated Room</h2>
          <div className="w-full rounded-xl overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              width={1600}
              height={900}
              alt="Generated Room"
              className="w-full h-auto object-cover"
            />
          </div>
          <p className="text-xl mt-3">
            ผลลัพธ์จาก Prompt: “{prompt}”
          </p>
        </div>
      </div>

      <div className="w-full lg:w-90 bg-white rounded-2xl shadow-md p-6 h-fit">
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
