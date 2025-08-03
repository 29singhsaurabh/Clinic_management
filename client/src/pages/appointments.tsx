import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Calendar, Clock, User, Eye, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import ScheduleAppointmentModal from "@/components/modals/schedule-appointment-modal";
import type { Appointment, Patient, User as UserType } from "@shared/schema";

interface AppointmentWithDetails extends Appointment {
  patient: Patient;
  doctor?: UserType;
}

interface AppointmentsResponse {
  appointments: AppointmentWithDetails[];
  total: number;
}

export default function Appointments() {
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { data, isLoading } = useQuery<AppointmentsResponse>({
    queryKey: ["/api/appointments", { date: selectedDate, status: statusFilter }],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "rescheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const todayStats = {
    total: data?.appointments.length || 0,
    completed: data?.appointments.filter(a => a.status === "completed").length || 0,
    pending: data?.appointments.filter(a => a.status === "scheduled").length || 0,
    cancelled: data?.appointments.filter(a => a.status === "cancelled").length || 0,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Appointment Management</h2>
          <p className="text-gray-600 mt-1">Schedule and manage patient appointments</p>
        </div>
        <Button onClick={() => setShowScheduleModal(true)} className="bg-green-600 hover:bg-green-700">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      {/* Calendar and Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Widget */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h4 className="font-semibold">December 2023</h4>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                  <div key={day} className="font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
                {/* Calendar days would be dynamically generated */}
                {Array.from({ length: 31 }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`p-2 cursor-pointer rounded hover:bg-gray-100 ${
                      i + 1 === 18 ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => setSelectedDate(`2023-12-${String(i + 1).padStart(2, '0')}`)}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Today's Summary */}
              <div className="pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Today's Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Appointments</span>
                    <span className="font-medium">{todayStats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completed</span>
                    <span className="font-medium text-green-600">{todayStats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-medium text-yellow-600">{todayStats.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cancelled</span>
                    <span className="font-medium text-red-600">{todayStats.cancelled}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Appointments</CardTitle>
              <div className="flex items-center space-x-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : data?.appointments.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No appointments found for the selected date
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {data?.appointments.map((appointment) => (
                    <div key={appointment.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {appointment.patient.fullName}
                            </h4>
                            <p className="text-sm text-gray-500 capitalize">
                              {appointment.type.replace("-", " ")}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {appointment.appointmentTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-green-600">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ScheduleAppointmentModal
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
      />
    </div>
  );
}
