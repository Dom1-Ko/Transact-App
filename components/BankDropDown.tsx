"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formUrlQuery, formatAmount } from "@/lib/utils";

export const BankDropdown = ({
  accounts = [],
  setValue,
  otherStyles,
}: BankDropdownProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selected, setSelected] = useState(accounts[0]);

  const handleBankChange = (id: string) => {
    // console.log({id})
    const account = accounts.find((account) => account.appwriteItemId === id)!;
    
    setSelected(account);

    // const newUrl = formUrlQuery({
    //   params: searchParams.toString(),
    //   key: "id",
    //   value: id,
    // });
    // router.push(newUrl, { scroll: false });

    if (setValue) {
      setValue("senderBank", id);
    }
  };

// console.log({selected});

  return (
    <Select
      defaultValue={selected.appwriteItemId}
      // value= {selected.appwriteItemId}
      onValueChange={(value) => handleBankChange(value)}
    >
      <SelectTrigger
        className={`flex !h-20 w-full bg-white gap-3 md:w-[300px] ${otherStyles}`}
      >
        <Image
          src="icons/credit-card.svg"
          width={28}
          height={28}
          alt="account"
        />
        <SelectValue className="line-clamp-1 w-full text-left" placeholder={`${selected.name}`}>
          {/* <p className="line-clamp-1 w-full text-left">{selected?.name}</p> */}
        </SelectValue>

      </SelectTrigger>
      <SelectContent
        className={`w-full bg-white md:w-[300px] ${otherStyles}`}
        align="end"
      >
        <SelectGroup>
          {/* <SelectLabel className="py-2 font-normal bg-white text-gray-500">
            Select a bank to display
          </SelectLabel> */}
          {accounts.map((account: Account) => {
            // console.log({account})
            return(
              <SelectItem
                key={account.id}
                value={account.appwriteItemId}
                className="cursor-pointer border-t"
              >
                <div className="flex flex-col">
                  <p className="text-16 font-medium">{account.name}</p>
                  <p className="text-14 font-medium text-blue-600">
                    {formatAmount(account.currentBalance)}
                  </p>
                </div>
              </SelectItem>          
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};