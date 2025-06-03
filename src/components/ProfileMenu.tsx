import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "./ui/button";
export default function ProfileMenu() {
  const { business } = useGetBusinessByUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Avatar className="size-6 border border-white">
            <AvatarImage src={business?.logo} />
            <AvatarFallback>{business?.nama?.charAt(0)}</AvatarFallback>
          </Avatar>
          {business?.nama}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Business</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Avatar className="size-5 bg-black">
            <AvatarImage src={business?.logo} />
            <AvatarFallback>{business?.nama?.charAt(0)}</AvatarFallback>
          </Avatar>
          {business?.nama}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
