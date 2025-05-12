import React from "react";
import useGetBusinessByUser from "@/hooks/getBusinessbyUser";
import useGetUsers from "@/hooks/getUsers";
export default function GreetingText() {
  const { users } = useGetUsers();
  const { business } = useGetBusinessByUser();
  return (
    <div>
      <h1 className="text-2xl font-bold">Welcome sir, {users?.fullname}</h1>
      <p className="text-xl">
        Lets grow your <strong>{business?.nama} business</strong> with us.
      </p>
    </div>
  );
}
