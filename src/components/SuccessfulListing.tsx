import { PhoneCall, CheckCircle2 } from 'lucide-react';
import React from 'react';
import { motion } from 'framer-motion';

const SuccessfulListing = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass rounded-2xl p-8 max-w-md w-full text-center space-y-6 shadow-xl border border-white/20 relative overflow-hidden"
      >
        {/* Decorative background gradients */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl rounded-full" />

        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>

          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Success!
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Your Hostel has been listed successfully.
          </p>
        </div>

        <div className="space-y-4 bg-secondary/30 p-4 rounded-xl backdrop-blur-sm">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Your hostel will be reviewed and approved within 24 hours.{" "}
            <span className="font-semibold text-primary">Fuse</span> will get in touch shortly.
          </p>
        </div>

        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-4">Need immediate assistance?</p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-black w-full shadow-lg group"
            href="tel:+233543983427"
          >
            <PhoneCall className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
            Contact Admin
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessfulListing