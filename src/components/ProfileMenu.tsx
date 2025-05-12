import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function ProfileMenu() {
  const { business } = useGetBusinessByUser();

  return (
    <div>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue
            placeholder={
              <p className="flex items-center gap-2">
                <Avatar className="size-5 bg-black">
                  <AvatarImage src={business?.logo} />
                  <AvatarFallback>{business?.nama?.charAt(0)}</AvatarFallback>
                </Avatar>
                {business?.nama}
              </p>
            }
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={String(business?.id)}>
            <Avatar className="size-5 bg-black">
              <AvatarImage src={business?.logo} />
              <AvatarFallback>{business?.nama?.charAt(0)}</AvatarFallback>
            </Avatar>
            {business?.nama}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
