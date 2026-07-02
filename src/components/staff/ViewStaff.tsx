import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStaffById } from "@/api/staff";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  CreditCard,
  Building,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CustomeRefetch from "@/components/CustomRefetch";
import dayjs from "dayjs";

const ViewStaff: React.FC = () => {
  const { id: staffId } = useParams();
  const navigate = useNavigate();

  const {
    data: staff,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["staff_details", staffId],
    queryFn: async () => {
      const responseData = await getStaffById(staffId!);
      return responseData.data;
    },
    enabled: !!staffId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return <CustomeRefetch refetch={refetch} />;
  }

  const InfoItem = ({
    icon: Icon,
    label,
    value,
    badge = false,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
    badge?: boolean;
  }) => {
    if (!value) return null;

    return (
      <div className="flex items-start gap-3 py-2">
        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-sm font-medium text-foreground truncate">
            {badge ? (
              <Badge variant="secondary" className="mt-1">
                {value}
              </Badge>
            ) : (
              value
            )}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Staff Details"
        subtitle="View staff member information"
        icon={User}
        showBackButton={true}
        backgroundImage="https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=1200&q=80"
        actions={
          <Button
            onClick={() => navigate(`/dashboard/staff-management/edit/${staffId}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Staff
          </Button>
        }
      />

      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  {staff?.passportUrl ? (
                    <img
                      src={staff.passportUrl}
                      alt={staff?.user?.name || "Staff"}
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-2xl border-2 border-border shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center rounded-2xl bg-primary/10 border-2 border-border">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold text-foreground">
                    {staff?.user?.name}
                  </h1>
                  <p className="text-muted-foreground mt-1">{staff?.role || "Staff"}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    <Badge variant="secondary">
                      {staff?.role || "Staff"}
                    </Badge>
                    {staff?.block && (
                      <Badge variant="outline">Block {staff.block}</Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/dashboard/staff-management/edit/${staffId}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Personal Details
              </CardTitle>
              <CardDescription>Basic information about the staff member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon={User}
                  label="Full Name"
                  value={staff?.user?.name}
                />
                <InfoItem
                  icon={CreditCard}
                  label="Gender"
                  value={staff?.user?.gender}
                  badge
                />
                <InfoItem
                  icon={Calendar}
                  label="Date of Birth"
                  value={staff?.dateOfBirth
                    ? dayjs(staff.dateOfBirth).format("MMM D, YYYY")
                    : null
                  }
                />
                <InfoItem
                  icon={MapPin}
                  label="Nationality"
                  value={staff?.nationality}
                />
                <InfoItem
                  icon={User}
                  label="Religion"
                  value={staff?.religion}
                  badge
                />
                <InfoItem
                  icon={User}
                  label="Marital Status"
                  value={staff?.maritalStatus}
                  badge
                />
                <InfoItem
                  icon={CreditCard}
                  label="Ghana Card Number"
                  value={staff?.ghanaCardNumber}
                />
                {staff?.middleName && (
                  <InfoItem
                    icon={User}
                    label="Middle Name"
                    value={staff.middleName}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                Contact Details
              </CardTitle>
              <CardDescription>How to reach the staff member</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem
                  icon={Phone}
                  label="Phone Number"
                  value={staff?.user?.phone}
                />
                <InfoItem
                  icon={Mail}
                  label="Email"
                  value={staff?.user?.email}
                />
                <InfoItem
                  icon={MapPin}
                  label="Residence"
                  value={staff?.residence}
                />
              </div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                Job Details
              </CardTitle>
              <CardDescription>Employment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoItem
                  icon={Briefcase}
                  label="Role"
                  value={staff?.role}
                  badge
                />
                <InfoItem
                  icon={Building}
                  label="Qualification"
                  value={staff?.qualification}
                />
                <InfoItem
                  icon={Building}
                  label="Assigned Block"
                  value={staff?.block || "Not assigned"}
                />
                <InfoItem
                  icon={Calendar}
                  label="Date of Appointment"
                  value={staff?.dateOfAppointment
                    ? dayjs(staff.dateOfAppointment).format("MMM D, YYYY")
                    : null
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={() => navigate(`/dashboard/staff-management/edit/${staffId}`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Staff
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewStaff;
