import Button from "./ui/Button";
import Input from "./ui/Input";
import { ChangeEvent, FormEvent, useState } from "react";
import Textarea from "./ui/Textarea";

import { faker } from "@faker-js/faker";
const TodoList = () => {
 
  return (
    <div className="space-y-1 ">
      <div className="flex w-fit mx-auto my-10 gap-x-2">
        <Button variant="default"  size={"sm"}>
          Post new todo
        </Button>
        <Button variant="outline" size={"sm"}>
          Generate todos
        </Button>
      </div>
      

    </div>
  );
};

export default TodoList;
