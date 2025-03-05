'use client'
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
  Chip,
  Progress,
  Tooltip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Calendar,
  RangeCalendar,
  DropdownItem,
  addToast
} from "@heroui/react";
import { SquarePen, CirclePlus, Delete, X, Check, CheckCheck } from "lucide-react"
import { today, getLocalTimeZone, parseDate } from "@internationalized/date";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { Project } from "./projects-table";
import { deleteProject } from "@/actions/projects";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";
import { Task } from "@/components/projects/projects-table"
import TaskAddModal from "../tasks/task-add-modal";
import { cancelAllTasks, deleteTask, finishAllTasks, finishTask } from "@/actions/tasks";
import TaskDeleteModal from "../tasks/task-delete-modal";
import ProjectEditModal from "./project-edit-modal";
import { Category } from "../categories/categories-table";
import { useSession } from "next-auth/react";

const ProjectView = ({ project, tasks, categories }: {
  project: Project | null | undefined,
  tasks: Task[] | undefined,
  categories: Category[] | undefined
}) => {
  const [verfificationText, setVerificationText] = useState("")

  useEffect(() => {
    console.log(project)
  }, [])

  const router = useRouter()
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)

  const handleDelete = async () => {
    if (verfificationText === "Delete my project") {
      setIsLoadingDelete(true)
      const deletedProject = await deleteProject(project)
      setIsLoadingDelete(false)
      addToast({
        title: "Project: " + project?.name,
        description: "Deleted successfully!!",
        color: "danger",
        timeout: 3000,
        shouldShowTimeoutProgess: true
      })
      router.push("/projects")
    }
  }

  const [openTaskAdd, setOpenTaskAdd] = useState(false)
  const [openTaskDelete, setOpenTaskDelete] = useState(false)

  const [currentTask, setCurrentTask] = useState<Task | null>(null)

  const [isLoadingTask, setIsLoadingTask] = useState(false)

  const handleFinishTask = async (task: Task) => {
    setIsLoadingTask(true)
    const updatedTask = await finishTask(task, project)
    setIsLoadingTask(false)
    addToast({
      title: "Task: " + task.name,
      description: "Done !!",
      color: "success",
      timeout: 3000,
      shouldShowTimeoutProgess: true
    })
  }

  const [isLoadingFinishAll, setIsLoadingFinishAll] = useState(false)

  const handleFinishAll = async () => {
    setIsLoadingFinishAll(true)
    const updatedProject = await finishAllTasks(project)
    setIsLoadingFinishAll(false)
    addToast({
      title: "All tasks done",
      description: "Success !!",
      color: "success",
      timeout: 3000,
      shouldShowTimeoutProgess: true
    })
  }

  const [isLoadingCancelAll, setIsLoadingCancelAll] = useState(false)

  const handleCancelAll = async () => {
    setIsLoadingCancelAll(true)
    const updatedProject = await cancelAllTasks(project)
    setIsLoadingCancelAll(false)
    addToast({
      title: "All tasks deleted",
      description: "Success",
      color: "danger",
      timeout: 3000,
      shouldShowTimeoutProgess: true
    })
  }

  const [openEditDetails, setOpenEditDetails] = useState(false)

  const { data: session } = useSession()

  const allowed = session?.user.role === "user"

  return (
    <div>
      <div className="flex flex-col gap-y-6 mb-8">
        {/* <section className="sticky top-[4.4rem] z-50 bg-background/70 backdrop-blur-lg"> */}
        <section>
          <div className="text-lg border-1 p-4 rounded-sm shadow-md flex justify-between items-center">
            <div className="flex">
              <span className="hidden md:block">Project Name:</span>
              <Chip className={`rounded-sm p-0 ml-2 ${project?.status === "Pending" ? "text-warning" : project?.status === "Finished" ? "text-success" : "text-primary"}`} color={project?.status === "Pending" ? "warning" : project?.status === "Finished" ? "success" : "primary"} variant="dot">{project?.name}</Chip>
            </div>
            <div className="flex gap-x-2 items-center">
              {project?.status === "Pending" && <Tooltip content="Finish" showArrow>
                <Button isIconOnly color="success" size="sm" startContent={!isLoadingFinishAll ? <Check /> : <></>} isDisabled={allowed} onPress={() => handleFinishAll()} isLoading={isLoadingFinishAll}></Button>
              </Tooltip>}
              <Tooltip content="Cancel" showArrow>
                <Button isIconOnly color="danger" size="sm" startContent={!isLoadingCancelAll ? <X /> : <></>} isDisabled={allowed} onPress={() => handleCancelAll()} isLoading={isLoadingCancelAll}></Button>
              </Tooltip>
              <Dropdown>
                <DropdownTrigger>
                  <Button color="primary" radius="sm" className="hidden md:block">Calendar</Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Calendar">
                  <DropdownItem key="dateRange" isReadOnly>
                    {project && <RangeCalendar isReadOnly defaultValue={{
                      start: parseDate(project.startDate.toISOString().split("T")[0]),
                      end: parseDate(project.endDate.toISOString().split("T")[0])
                    }} />}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-x-3">
              <h1 className="text-xl">Details</h1>
              <Tooltip content="Edit details" color="primary" showArrow>
                <Button isIconOnly startContent={<SquarePen className="size-4" />} size="sm" variant="shadow" color="warning" isDisabled={allowed} onPress={() => setOpenEditDetails(true)}></Button>
              </Tooltip>
            </div>
            <div className="block p-2 bg-default-50">
              <h1 className="font-bold text-danger">Deadline</h1>
              <span className="text-tiny p-1 bg-default-200 font-semibold">{project?.endDate.toDateString()}</span>
            </div>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="aspect-video rounded-md bg-default-50">
              <div className="flex flex-col p-3 gap-y-8">
                <h1 className="text-lg">Total Costs <span className="bg-default-200 px-2 py-1">in $</span></h1>
                <div className="w-full">
                  <Chip color="success" variant="flat" className="text-xl">{project?.price} $</Chip>
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-md bg-default-50">
              <div className="flex flex-col p-3 gap-y-6">
                <h1 className="text-lg">Progess</h1>
                <div className="w-full">
                  <Progress showValueLabel color={project?.progress === 100 ? "success" : "primary"} value={project?.progress} />
                </div>
              </div>
            </div>
            <div className="aspect-video rounded-md bg-default-50">
              <div className="flex flex-col p-3 gap-y-8">
                <h1 className="text-lg">Category</h1>
                <div className="w-full">
                  <Chip color="primary" className="rounded-sm">
                    {project?.category.name}
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="flex items-center mb-3 gap-x-3">
            <h1 className="text-xl">Tasks</h1>
            <Tooltip content="Add task" color="primary" showArrow>
              <Button isIconOnly startContent={<CirclePlus className="size-4" />} isDisabled={allowed} size="sm" variant="shadow" color="success" onPress={() => setOpenTaskAdd(true)}></Button>
            </Tooltip>
          </div>
          {tasks?.length !== 0 ?
            <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {tasks?.map((task, index) => (
                <div className=" rounded-md bg-default-50" key={String(task.id)}>
                  <div className="flex flex-col p-3 gap-y-4 h-full">
                    <div className="flex items-center justify-between">
                      <h1 className="text-xl font-bold">Task {index + 1}</h1>
                      <Button isIconOnly size="sm" variant="flat" color="danger" startContent={<X />} isDisabled={allowed} onPress={() => {
                        setOpenTaskDelete(true)
                        setCurrentTask(task)
                      }}></Button>
                    </div>
                    <span className="bg-default-200 rounded-sm p-1 text-tiny w-auto">Time needed: {String(task.timeNeeded)} Days</span>

                    <Separator />
                    <div className="w-full flex flex-col gap-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-lg">{task.name}</span>
                        <span>{String(task.cost)} $</span>
                      </div>
                      <Chip className={`rounded-sm ${task.status === "Pending" ? "text-warning" : task.status === "Done" ? "text-success" : "text-primary"}`} color={task.status === "Pending" ? "warning" : task.status === "Done" ? "success" : "primary"} variant="dot">{task.status}</Chip>
                      <Separator />
                      <Button color="success" startContent={isLoadingTask && currentTask?.id === task.id ? <></> : <Check />} isDisabled={task.status !== "Pending" || allowed} onPress={() => {handleFinishTask(task); setCurrentTask(task)}} isLoading={isLoadingTask && currentTask?.id === task.id}></Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            : (
              <Alert color="warning" title="No tasks assigned yet" className="w-full" />
            )}
        </section >

        <section className="flex flex-col gap-4 bg-default-50 p-2 py-4 rounded-md shadow-md">
          <div className="flex flex-col">
            <span className="text-lg">Are you sure you want to delete this project ?</span>
          </div>
          <span className="text-sm text-default-900">If yes, type <span className="text-danger">Delete my project</span> and click the button.</span>
          <Input placeholder="Delete my project" isDisabled={allowed} onChange={e => setVerificationText(e.target.value)} variant="faded" label="Type the verification text" />
          <Button color="danger" radius="sm" variant="flat" isDisabled={verfificationText !== "Delete my project" || allowed} onPress={() => handleDelete()} isLoading={isLoadingDelete}>Delete Project</Button>
        </section>
      </div >
      <ProjectEditModal open={openEditDetails} setOpen={setOpenEditDetails} categories={categories} project={project} />
      <TaskAddModal open={openTaskAdd} setOpen={setOpenTaskAdd} project={project} />
      <TaskDeleteModal open={openTaskDelete} setOpen={setOpenTaskDelete} task={currentTask} project={project} />
    </div>
  );
}

export default ProjectView