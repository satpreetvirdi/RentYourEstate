'use client'
import useRentModal from "@/app/hooks/useRentModal"
import Modal from "./Modal"
import { useMemo, useState } from "react";
import Heading from "../Heading";
import  {categories}  from '../navbar/Categories';
import CategoryInput from "../inputs/CategoryInput";
enum STEPS{ 
  CATEGORY =0,
  LOCATION =1,
  INFO =2,
  IMAGES =3,
  DESCRIPTION =4,
  PRICE =5
}

const RentModal = () => {
    const rentModal = useRentModal();
    const [steps , setSteps] = useState(STEPS.CATEGORY);

    const onBack = ()=>{
      setSteps((value)=>value-1);
    }
    const onNext = ()=>{
      setSteps((value)=>value+1);
    }

      const actionLabel = useMemo(()=>{
        if(steps === STEPS.PRICE){
          return "Create";
        }
        return "Next";
      },[steps]);

      const secondaryActionLabel = useMemo(()=>{
        if(steps=== STEPS.CATEGORY){
          return undefined;
        }
        return "Back";
      },[steps])

      let bodyContent = (
        <div className="flex flex-col gap-8">
          <Heading
            title="Which of these best describes your place?"
            subtitle="Pick a category"
          />
          <div 
            className="
              grid 
              grid-cols-1 
              md:grid-cols-2 
              gap-3
              max-h-[50vh]
              overflow-y-auto
            "
          >
            {categories.map((item) => (
              <div key={item.label} className="col-span-1">
                {/* <CategoryInput
                  onClick={()=>{}}
                  selected={false}
                  label={item.label}
                  icon={item.icon}
                /> */}
              </div>
            ))}
          </div>
        </div>
      )

      return (
    <Modal 
    isOpen={rentModal.isOpen}
    onClose={rentModal.onClose}
    onSubmit={rentModal.onClose}
    actionLabel={actionLabel}
    secondaryActionLabel={secondaryActionLabel}
    secondaryAction = {steps===STEPS.CATEGORY ? undefined : onBack}
    title="Airbnb your home"
    />
  )
}

export default RentModal