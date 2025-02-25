'use client'
import ProjectAddModal from "../projects/project-add-modal"
import { ModalProvider } from "../context/ModalContextProvider"
import { useContext } from "react"

export const Modals = () => {
    const { openProjectAdd, setOpenProjectAdd, categories } = useContext(ModalProvider)
    return (
        <>
            <ProjectAddModal open={openProjectAdd} setOpen={setOpenProjectAdd} categories={categories} />
        </>
    )
}

export default Modals