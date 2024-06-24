"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "@/api/clientAxios";
import { dataURLtoFile } from "@/util/convertType";

const PrintPage: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = sessionStorage.getItem("exportedImage");
    if (image) {
      setImageSrc(image);
    } else {
      router.push("/machine/edit/photo");
    }
  }, [router]);

  const handlePrint = async () => {
    if (!imageRef.current) return;

    const image = imageRef.current.src;
    const file = dataURLtoFile(image, "image.png");
    const formData = new FormData();
    formData.append("upload_file", file);

    axios({
      method: "POST",
      url: "/api/epson/print",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-4xl mt-10 px-4 flex flex-col items-center gap-6">
        <div className="text-[#ae76cc] text-center font-semibold text-4xl">
          기억을 담은 사진을 출력해보세요.
        </div>
        <div className="text-[#828282] text-center font-regular text-lg">
          사진을 출력해서, 기억까지 출력하세요.
        </div>
        <Link href="/about">
          <div className="bg-[#ae76cc] text-[#ffdddd] rounded-lg px-6 py-3 shadow cursor-pointer">
            서비스 소개페이지로 돌아기기
          </div>
        </Link>
        <div className="flex flex-col items-center gap-6 mt-10">
          {imageSrc && (
            <div
              id="printable-area"
              className="bg-gray-200 rounded-lg overflow-hidden w-[1281px] h-[721px] flex items-center justify-center"
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Exported"
                className="object-cover w-full h-full"
              />
            </div>
          )}
        </div>
        <div className="mt-10">
          <button
            className="btn btn-active bg-[#A974FF] font-medium px-6 py-3.5 text-[white] border-0 mb-10"
            onClick={handlePrint}
          >
            완성한 사진 출력하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintPage;