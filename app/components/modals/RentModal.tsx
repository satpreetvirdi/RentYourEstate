'use client'
import useRentModal from "@/app/hooks/useRentModal"
import Modal from "./Modal"
import { useMemo, useState } from "react";
import Heading from "../Heading";
import  {categories}  from '../navbar/Categories';
import CategoryInput from "../inputs/CategoryInput";
import { FieldValues, useForm , SubmitHandler} from "react-hook-form";
import CountrySelect from "../inputs/CountrySelect";
import Map from "../Map";
import dynamic from "next/dynamic";
import Counter from "../inputs/Counter";
import ImageUpload from "../inputs/ImageUpload";
import Inputs from "../inputs/Inputs";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
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
    const router = useRouter();
    const [steps , setSteps] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading] = useState(false);
 
    const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState:{
        errors,
      },
      reset
    } = useForm<FieldValues>({
      defaultValues:{
      category:'' ,
      location:null,
      guestCount:1,
      roomCount:1,
      bathroomCount:1,
      imageSrc:'',
      price:1,
      title:'',
      description:''
    }
    });
    
    const category = watch('category');
    const location = watch('location');
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');
    const Map = useMemo(()=>dynamic(()=>import('../Map'),{
      ssr:false
    }),[location])
    
    const setCustomValues = (id:string, value :any)=>{
      setValue(id,value,{
        shouldValidate:true,
        shouldDirty:true,
        shouldTouch:true
      })
    }

    const onBack = ()=>{
      setSteps((value)=>value-1);
    }
    const onNext = ()=>{
      setSteps((value)=>value+1);
    }

    const onSubmit : SubmitHandler<FieldValues> = (data) =>{
      if(steps != STEPS.PRICE){
        return onNext();
      }
      setIsLoading(true);

      axios.post('/api/listings', data)
      .then(()=>{
        toast.success('Listing Created');
        router.refresh();
        reset();
        setSteps(STEPS.CATEGORY);
        rentModal.onClose();
      })
      .catch(()=>{
        toast.error('Something went wrong');
      })
      .finally(()=>setIsLoading(false));
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
      },[steps]);

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
                <CategoryInput
                  onClick={(category)=>{
                    setCustomValues('category',category);
                  }}
                  selected={category == item.label}
                  label={item.label}
                  icon={item.icon}
                />
              </div>
            ))}
          </div>
        </div>
      )
      
      if(steps === STEPS.LOCATION){
        bodyContent = (
          <div className="flex flex-col gap-8">
          <Heading
            title="Where is your place located?"
            subtitle="Help guests find you!"
          />
          <CountrySelect 
            value={location} 
            onChange={(value) => setCustomValues('location', value)} 
          />
          <Map
          center={location?.latlng}
          />
        </div>
          )
      }

      if (steps === STEPS.IMAGES) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Add a photo of your place"
              subtitle="Show guests what your place looks like!"
            />
            <ImageUpload
              onChange={(value) => setCustomValues('imageSrc', value)}
              value={imageSrc}
            />
          </div>
        )
      }

      if (steps === STEPS.INFO) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Share some basics about your place"
              subtitle="What amenitis do you have?"
            />
            <Counter 
              onChange={(value) => setCustomValues('guestCount', value)}
              value={guestCount}
              title="Guests" 
              subtitle="How many guests do you allow?"
            />
            <hr />
            <Counter 
              onChange={(value) => setCustomValues('roomCount', value)}
              value={roomCount}
              title="Rooms" 
              subtitle="How many rooms do you have?"
            />
            <hr />
            <Counter 
              onChange={(value) => setCustomValues('bathroomCount', value)}
              value={bathroomCount}
              title="Bathrooms" 
              subtitle="How many bathrooms do you have?"
            />
          </div>
        )
      }

      if (steps === STEPS.IMAGES) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Add a photo of your place"
              subtitle="Show guests what your place looks like!"
            />
            <ImageUpload
              onChange={(value) => setCustomValues('imageSrc', value)}
              value={imageSrc}
            />
          </div>
        )
      }
      
      if (steps === STEPS.DESCRIPTION) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="How would you describe your place?"
              subtitle="Short and sweet works best!"
            />
            <Inputs
              id="title"
              label="Title"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
            <hr />
            <Inputs
              id="description"
              label="Description"
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
        )
      }
      
      if (steps === STEPS.PRICE) {
        bodyContent = (
          <div className="flex flex-col gap-8">
            <Heading
              title="Now, set your price"
              subtitle="How much do you charge per night?"
            />
            <Inputs
              id="price"
              label="Price"
              formatPrice 
              type="number" 
              disabled={isLoading}
              register={register}
              errors={errors}
              required
            />
          </div>
        )
      }

      return (
    <Modal 
    isOpen={rentModal.isOpen}
    onClose={rentModal.onClose}
    onSubmit={handleSubmit(onSubmit)}
    actionLabel={actionLabel}
    secondaryActionLabel={secondaryActionLabel}
    secondaryAction = {steps===STEPS.CATEGORY ? undefined : onBack}
    title="Airbnb your home"
    body={bodyContent}
    />
  )
}

export default RentModal