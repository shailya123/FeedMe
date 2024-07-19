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
    value?:string
}
  export default function Selectdemo({items,type,onChange,value}:props) {
    return (
      <Select onValueChange={(e)=>onChange(e)}>
        <SelectTrigger >
          <SelectValue placeholder={value??`Select a ${type}`} defaultValue={value} defaultChecked />
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