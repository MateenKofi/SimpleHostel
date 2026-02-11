import { Card } from "@/components/ui/card";
import SEOHelmet from "@/components/SEOHelmet";
import ProfileForms from "@/components/Profile-Forms";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserCircle } from "lucide-react";

const ProfileForm = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHelmet
        title="Profile - Fuse"
        description="Manage your profile settings and personal information."
        keywords="profile, settings, Fuse"
      />
      <PageHeader
        title="Account Settings"
        subtitle="Manage your account settings and update your personal information"
        icon={UserCircle}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6">
            <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>
            <ProfileForms />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ProfileForm;
