'use client'
import { createContext, useState } from "react"

export const ModalProvider = createContext()

const ModalContextProvider = ({ children }) => {
    const [openProjectEdit, setOpenProjectEdit] = useState(false)
    const [openProjectAdd, setOpenProjectAdd] = useState(false)
    const [openTaskAdd, setOpenTaskAdd] = useState(false)
    const [openTaskDelete, setOpenTaskDelete] = useState(false)
    const [currentProject, setCurrentProject] = useState("")
    const [currentTask, setCurrentTask] = useState("")
    const [categories, setCategories] = useState([])

    return (
        <ModalProvider.Provider value={{
            openProjectAdd, setOpenProjectAdd,
            openProjectEdit, setOpenProjectEdit,
            openTaskAdd, setOpenTaskAdd,
            openTaskDelete, setOpenTaskDelete,
            currentProject, setCurrentProject,
            currentTask, setCurrentTask,
            categories, setCategories
        }}>
            {children}
        </ModalProvider.Provider>
    )
}

export default ModalContextProvider