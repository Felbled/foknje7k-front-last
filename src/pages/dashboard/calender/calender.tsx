import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { EventApi } from "@fullcalendar/core";
import moment from "moment";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import {
  addEventToGroupService,
  deleteEventGroupService,
  getEventGroupService,
  updateEventGroupService,
} from "../../../services/event-service";
import { getUserGroupService } from "../../../services/group-service";
import CustomSelect from "../../../shared/custom-select/custom-select";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import { RootState } from "../../../redux/store/store";
import { useSelector } from "react-redux";
import role from "../../auth/role/role";

interface CustomHeaderProps {
  currentDate: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onWeekView: () => void;
  onMonthView: () => void;
  activeView: string;
}
const colorOptions = [
  { hex: "#0369A1", rgba: "rgba(3, 105, 161, 0.3)" },
  { hex: "#FEBA0C", rgba: "rgba(254, 186, 12, 0.3)" },
  { hex: "#00DF76", rgba: "rgba(0, 223, 118, 0.3)" },
  { hex: "#9C4DF4", rgba: "rgba(156, 77, 244, 0.3)" },
  { hex: "#F8BAD4", rgba: "rgba(248, 186, 212, 0.3)" },
  { hex: "#CC6144", rgba: "rgba(204, 97, 68, 0.3)" },
];

const Calendar: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(moment().format("MMMM, YYYY"));
  const [activeView, setActiveView] = useState("dayGridMonth");
  const [groupOptions, setGroupOptions] = useState<
    { label: string; value: number }[]
  >([]);
  const userRole = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // New state to track if editing
  const [events, setEvents] = useState<any>([]);
  const [eventData, setEventData] = useState({
    id: null,
    title: "",
    start: "",
    end: "",
    backgroundColor: colorOptions[0].rgba,
    classId: null,
  });

  // Fetch group options and event data based on the selected group
  useEffect(() => {
    getUserGroupService()
      .then((res) => {
        const options = res.data.map((group: any) => ({
          label: group.title,
          value: group.id,
        }));
        if (options.length > 0) {
          setEventData({ ...eventData, classId: options[0].value });
        }
        setGroupOptions(options);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // Fetch event data when the classId changes
  useEffect(() => {
    if (eventData.classId !== null) {
      getEventGroupService(eventData.classId)
        .then((res) => {
          const eventsData = res.data.map((e: any) => ({
            id: e.id,
            title: e.title,
            start: e.startTime,
            end: e.endTime,
            backgroundColor: e.backgroundColor,
          }));
          setEvents(eventsData);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }, [eventData.classId]);

  // Handle group selection change
  const handleSelectChange = (selectedValue: any) => {
    setEventData((prevState) => ({
      ...prevState,
      classId: selectedValue.target.value,
    }));
  };

  // Handle calendar navigation (previous, next, today)
  const handlePrevClick = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.prev();
      updateCurrentDate(api.getDate());
    }
  };

  const handleNextClick = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.next();
      updateCurrentDate(api.getDate());
    }
  };

  const handleTodayClick = () => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.today();
      updateCurrentDate(api.getDate());
    }
  };

  const updateCurrentDate = (date: Date) => {
    setCurrentDate(moment(date).format("MMMM, YYYY"));
  };

  // Open the dialog for adding a new event
  const handleOpen = () => {
    setOpen(true);
    setIsEditMode(false);
    setEventData({
      id: null,
      title: "",
      start: "",
      end: "",
      backgroundColor: colorOptions[0].rgba,
      classId: eventData.classId,
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>,
  ) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name as string]: value,
    });
  };

  // Handle form submission for both add and edit mode
  const handleSubmit = () => {
    if (isEditMode) {
      // Handle event editing logic
      updateEventGroupService(eventData.classId, eventData.id, {
        title: eventData.title,
        backgroundColor: eventData.backgroundColor,
        endTime: eventData.end,
        startTime: eventData.start,
      })
        .then(() => {
          setEvents((prevEvents: any[]) =>
            prevEvents.map((event: any) =>
              event.id === eventData.id ? eventData : event,
            ),
          );
          handleClose();
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      addEventToGroupService(eventData.classId, {
        title: eventData.title,
        backgroundColor: eventData.backgroundColor,
        endTime: eventData.end,
        startTime: eventData.start,
      })
        .then((res) => {
          setEvents((prevEvents: any) => [...prevEvents, res.data]);
          handleClose();
          window.location.reload();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const handleDelete = () => {
    deleteEventGroupService(eventData.classId, eventData.id)
      .then((res) => {
        getEventGroupService(eventData.classId).then((res) => {
          const eventsData = res.data.map((e: any) => ({
            id: e.id,
            title: e.title,
            start: e.startTime,
            end: e.endTime,
            backgroundColor: e.backgroundColor,
          }));
          setEvents(eventsData);
        });
        handleClose();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const handleEventClick = (info: { event: EventApi }) => {
    if (userRole === "ROLE_ADMIN" || userRole === "ROLE_SUPER_TEACHER") {
      setIsEditMode(true);
      setOpen(true);
      navigator.clipboard.writeText(info.event.title).then(() => {});
      setEventData({
        // @ts-ignore
        id: info.event.id,
        title: info.event.title,
        start: moment(info.event.start).format("YYYY-MM-DDTHH:mm"),
        end: moment(info.event.end).format("YYYY-MM-DDTHH:mm"),
        backgroundColor: info.event.backgroundColor || colorOptions[0].rgba,
        classId: eventData.classId,
      });
    } else {
      navigator.clipboard.writeText(info.event.title).then(() => {
        alert("Texte copié: " + info.event.title);
      });
    }
  };
  const handleCustomButtonClick = (viewType: string) => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.changeView(viewType);
      setActiveView(viewType);
    }
  };
  return (
    <div className="w-full pb-4 bg-white p-5 rounded-3xl">
      <CustomHeader
        currentDate={currentDate}
        onPrev={handlePrevClick}
        onNext={handleNextClick}
        onToday={handleTodayClick}
        onWeekView={() => handleCustomButtonClick("timeGridWeek")}
        onMonthView={() => handleCustomButtonClick("dayGridMonth")}
        activeView={activeView}
        onOpenModal={handleOpen}
        groupOptions={groupOptions}
        classId={eventData.classId}
        handleSelectChange={handleSelectChange}
      />
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
        initialView="dayGridMonth"
        events={events}
        height={"100vh"} // Ensure the height is responsive
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        headerToolbar={false}
      />
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditMode ? "Edit Event" : "Add New Event"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Event Title"
            type="text"
            fullWidth
            variant="outlined"
            name="title"
            value={eventData.title}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Start Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            name="start"
            value={eventData.start}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            margin="dense"
            label="End Time"
            type="datetime-local"
            fullWidth
            variant="outlined"
            name="end"
            value={eventData.end}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth variant="outlined" margin="dense">
            <InputLabel>Background Color</InputLabel>
            <Select
              name="backgroundColor"
              value={eventData.backgroundColor}
              //@ts-ignore
              onChange={handleChange}
              label="Background Color"
            >
              {colorOptions.map((color) => (
                <MenuItem key={color.hex} value={color.rgba}>
                  <div
                    style={{
                      backgroundColor: color.rgba,
                      width: "20px",
                      height: "20px",
                      display: "inline-block",
                      marginRight: "10px",
                    }}
                  />
                  {color.hex}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          {isEditMode && (
            <Button onClick={handleDelete} variant="outlined" color="error">
              Supprimer
            </Button>
          )}
          <Button onClick={handleSubmit} variant="outlined" color="primary">
            {isEditMode ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
function renderEventContent(eventInfo: { event: EventApi }) {
  const startTime = moment(eventInfo.event.start).format("h:mm A");
  const endTime = moment(eventInfo.event.end).format("h:mm A");

  return (
    <div
      className="flex flex-col justify-end p-2 rounded text-white"
      style={{
        backgroundColor: eventInfo.event.backgroundColor || "#000",
        opacity: 0.85,
        width: "100%", // ensure it takes up available width
      }}
    >
      <span className="text-sm">
        {startTime} - {endTime}
      </span>
      <strong
        className="block"
        style={{
          wordWrap: "break-word",
          overflow: "hidden",
          whiteSpace: "normal",
        }}
      >
        {eventInfo.event.title}
      </strong>
    </div>
  );
}

const CustomHeader: React.FC<
  CustomHeaderProps & {
    onOpenModal: () => void;
    groupOptions: { label: string; value: number }[];
    classId: number | null;
    handleSelectChange: any;
  }
> = ({
  currentDate,
  onPrev,
  onNext,
  onToday,
  onWeekView,
  onMonthView,
  activeView,
  onOpenModal,
  groupOptions,
  classId,
  handleSelectChange,
}) => {
  const userRole = useSelector(
    (state: RootState) => state?.user?.userData?.role.name,
  );

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-gray-800 text-title p-4">
      <div className="flex items-center mb-2 md:mb-0">
        <IconButton
          className="hover:bg-gray-700 rounded"
          color="inherit"
          onClick={onPrev}
        >
          <ArrowLeft />
        </IconButton>
        <div className="text-lg font-semibold flex flex-col items-center">
          <div>{currentDate}</div>
        </div>
        <IconButton
          className="hover:bg-gray-700 rounded"
          color="inherit"
          onClick={onNext}
        >
          <ArrowRight />
        </IconButton>
      </div>

      <div className="flex items-center space-x-2 mb-2 md:mb-0">
        <div
          className={`capitalize font-montserrat_semi_bold text-lg px-4 py-2 cursor-pointer ${
            activeView === "timeGridWeek"
              ? "text-white bg-primary rounded-lg"
              : "text-title"
          }`}
          onClick={onWeekView}
        >
          Semaine
        </div>
        <div
          className={`capitalize font-montserrat_semi_bold text-lg px-4 py-2 cursor-pointer ${
            activeView === "dayGridMonth"
              ? "text-white bg-primary rounded-lg"
              : "text-title"
          }`}
          onClick={onMonthView}
        >
          Mois
        </div>
      </div>

      <div className="flex lg:flex-row flex-col items-center">
        {(userRole === "ROLE_ADMIN" || userRole === "ROLE_SUPER_TEACHER") && (
          <Button onClick={onOpenModal} className="text-nowrap">Add Event</Button>
        )}
        <CustomSelect
          placeholder={"Select Class"}
          customStyle="me-3"
          width={"w-full md:w-4/6"}
          options={groupOptions}
          //@ts-ignore
          value={classId}
          onChange={handleSelectChange}
          name="classId"
        />
      </div>
    </div>
  );
};

export default Calendar;
