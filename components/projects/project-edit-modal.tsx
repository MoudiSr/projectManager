import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Select,
    SelectItem,
    Alert,
    DateRangePicker,
    RangeValue,
    DateValue,
    addToast,
  } from "@heroui/react";
  import { useEffect, useState } from "react";
  import { Category } from "../categories/categories-table";
import { editProject } from "@/actions/projects";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { Project } from "./projects-table";
  
  const ProjectEditModal = ({ open, setOpen, categories, project }: {
    open: boolean,
    setOpen: (value: boolean) => void,
    categories: Category[] | undefined,
    project: Project | null | undefined
  }) => {
  
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
    useEffect(() => {
      if (open) onOpen()
    }, [open])

    const [isLoading, setIsLoading] = useState(false)
  
    const handleClose = () => {
      setIsLoading(false)
      setOpen(false)
      setAlert(false)
      onOpenChange()
      setName("")
      setDescription("")
      setCategory(undefined)
      setDateRange(null)
    }
  
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState<Category | undefined>(undefined)
    const [dateRange, setDateRange] = useState<RangeValue<DateValue> | null>(null)
  
    const [alert, setAlert] = useState(false)
  
    const handleSubmit = async () => {
      if (name.replaceAll(" ", "") !== "" && description.replaceAll(" ", "") !== "") {
        setIsLoading(true)
        const updatedProject = await editProject(project?.id, name, description, category, project?.category, dateRange?.start.toString(), dateRange?.end.toString()) 
        addToast({
          title: "Project: " + name,
          description: "Edited successfully!!",
          color: "warning",
          timeout: 3000,
          shouldShowTimeoutProgess: true
        })
        handleClose()
      } else {
        setAlert(true)
        setTimeout(() => {
          setAlert(false)
        }, 1000)
      }
    }

    useEffect(() => {
        setName(String(project?.name))
        setDescription(String(project?.description))
        setCategory(project?.category)
        if (project?.startDate && project.endDate) setDateRange({
          start: parseDate(project?.startDate.toISOString().split("T")[0]),
          end: parseDate(project?.endDate.toISOString().split("T")[0])
        })
    }, [open])
    

  
    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={handleClose} placement="center">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Edit Project</ModalHeader>
                <ModalBody>
                  <Alert title="Fill all fields" isVisible={alert} color="danger" />
                  <Input label="Project" variant="flat" value={name} onChange={e => setName(e.target.value)} isRequired isClearable />
                  <Input label="Description" variant="flat" value={description} onChange={e => setDescription(e.target.value)} isRequired isClearable />
                  <Select label="Category" isRequired placeholder={project?.category.name}>
                    {categories !== undefined ? categories?.map(category => (
                      <SelectItem key={category.id} onPress={() => setCategory(category)}>{category.name}</SelectItem>
                    )) : <></>}
                  </Select>
                  {project && <DateRangePicker label="Start date" minValue={today(getLocalTimeZone())} defaultValue={{
                    start: parseDate(project.startDate.toISOString().split("T")[0]),
                    end: parseDate(project.endDate.toISOString().split("T")[0])
                  }} onChange={setDateRange}/>}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="success" onPress={handleSubmit} isLoading={isLoading}>
                    Submit
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
  
  export default ProjectEditModal