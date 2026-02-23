import { Building2 } from "lucide-react";
import { motion } from "framer-motion";

export const ListingFormHeader = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-2 pt-2 md:pt-0"
        >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-forest-green-100 text-forest-green-700 rounded-full text-xs md:text-sm font-semibold mb-2">
                <Building2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Hostel Partner Program</span>
                <span className="sm:hidden">Partner Program</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground px-2">
                List Your Hostel
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-xs md:text-sm px-4">
                Join Ghana's largest student accommodation network and reach thousands of students today.
            </p>
        </motion.div>
    );
};
