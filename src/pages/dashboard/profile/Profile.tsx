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
        sticky={true}
        backgroundImage="https://images.unsplash.com/photo-1553095066-5014bc7b7f2d?auto=format&fit=crop&w=1200&q=80"
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
