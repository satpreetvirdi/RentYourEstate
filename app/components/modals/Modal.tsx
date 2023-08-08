"use client"
import { useEffect, useState } from "react";

interface ModalProps{
    isOpen?: boolean;
    onClose: ()=> void;
    onSubmit:()=>void;
    title?:String;
    body?:React.ReactElement;
    footer?: React.ReactElement;
    actionLabel: String;
    disabled?: boolean;
    secondaryAction ?: ()=> void;
    secondaryLabel ?: String;
}

const modal:React.FC<ModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    title,
    body,
    footer,
    actionLabel,
    disabled,
    secondaryAction,
    secondaryLabel
}) => {

    const[showModal, setShowModal] = useState(isOpen)
    useEffect(()=>{
        setShowModal(isOpen);
    },[isOpen])
  return (
    <div>   </div>
  )
}

export default modal