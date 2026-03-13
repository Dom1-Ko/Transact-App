"use client";

import { useSearchParams, useRouter } from "next/navigation";

import { cn, formUrlQuery } from "@/lib/utils";

export const BankTabItem = ({ account, appwriteItemId, shareableId }: BankTabItemProps) => {   //accept account, and appwriteItemId
  const searchParams = useSearchParams();
  const router = useRouter();
  // const isActive = appwriteItemId === account?.appwriteItemId; 
  // chk if it is active
  const isActive = appwriteItemId === account?.appwriteItemId;
  const urlShareableId = isActive ? account.shareableId : shareableId;
  console.log('sid',shareableId);


  // based on active state we will show the approriate div
  const handleBankChange = () => {

    //modify url
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "shareableId",
      value: shareableId,
    });
    router.push(newUrl, { scroll: false });
    router.refresh();
  };

  return (
    <div
      onClick={handleBankChange}
      className={cn(`banktab-item`, {
        "border-blue-600": isActive,
      })}
    >
      <p
        className={cn(`text-16 line-clamp-1 flex-1 font-medium text-gray-500`, {
          "text-blue-600": isActive,
        })}
      >
        {account.name}
      </p>
    </div>
  );
};