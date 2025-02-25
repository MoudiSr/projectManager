'use client'
import ProductAddModal from "../projects/project-add-modal"
import { ModalProvider } from "../context/ModalContextProvider"
import { useContext } from "react"

export const Modals = () => {
    const { openProjectAdd, setOpenProjectAdd, categories } = useContext(ModalProvider)
    return (
        <>
            <ProductAddModal open={openProjectAdd} setOpen={setOpenProjectAdd} categories={categories} />
        </>
    )
}

export default Modals