import * as React from "react"
 
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type props={
    items:string[],
    type:string,
    onChange:(value:string)=>void,
    defaultValue:string
}
  export default function Selectdemo({items,type,onChange,defaultValue}:props) {
    return (
      <Select onValueChange={(e)=>onChange(e)}>
        <SelectTrigger >
          <SelectValue placeholder={defaultValue??`Select a ${type}`} defaultValue={defaultValue} defaultChecked />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>select</SelectLabel>
            {items?.map((x:string)=>{
               return <SelectItem value={x} key={x}>{x}</SelectItem>
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }  