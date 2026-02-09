import { Card } from "@/components/ui/card";
import SEOHelmet from "@/components/SEOHelmet";
import ProfileForms from "@/components/Profile-Forms";

const ProfileForm = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-6 lg:p-8">
      <SEOHelmet
        title="Profile - Fuse"
        description="Manage your profile settings and personal information."
        keywords="profile, settings, Fuse"
      />
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="p-3 bg-white border rounded-md shadow-md">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="mt-2 text-xs italic font-thin text-gray-400">
            Manage your account settings and update your personal information
            here. Changes you make will be reflected across your profile.
          </p>
        </div>
        {/* Personal Information Form */}
        <Card className="p-6">
          <h2 className="mb-6 text-lg font-semibold">Personal Information</h2>
          <ProfileForms />
        </Card>
      </div>
    </div>
  );
};

export default ProfileForm;
