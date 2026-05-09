// vite.config.ts
import { defineConfig } from "file:///E:/Projects/Fuse/SimpleHostel/node_modules/.pnpm/vite@5.4.11_@types+node@22.10.2/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Projects/Fuse/SimpleHostel/node_modules/.pnpm/@vitejs+plugin-react@4.3.3_vite@5.4.11_@types+node@22.10.2_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import Sitemap from "file:///E:/Projects/Fuse/SimpleHostel/node_modules/.pnpm/vite-plugin-sitemap@0.8.2/node_modules/vite-plugin-sitemap/dist/index.js";
import { visualizer } from "file:///E:/Projects/Fuse/SimpleHostel/node_modules/.pnpm/rollup-plugin-visualizer@6.0.5_rollup@4.26.0/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import viteCompression from "file:///E:/Projects/Fuse/SimpleHostel/node_modules/.pnpm/vite-plugin-compression@0.5_ca057001d48a6488e28d80e6855afce6/node_modules/vite-plugin-compression/dist/index.mjs";
var __vite_injected_original_import_meta_url = "file:///E:/Projects/Fuse/SimpleHostel/vite.config.ts";
var __dirname = dirname(fileURLToPath(__vite_injected_original_import_meta_url));
var vite_config_default = defineConfig({
  plugins: [
    react(),
    Sitemap({ hostname: "https://simple-hostel.vercel.app" }),
    visualizer({ open: false, gzipSize: true, brotliSize: true, filename: "stats.html" }),
    viteCompression({
      algorithm: "gzip",
      ext: ".gz"
    }),
    viteCompression({
      algorithm: "brotliCompress",
      ext: ".br"
    })
  ],
  server: {
    port: 5173
    // Frontend port (Vite default)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@providers": path.resolve(__dirname, "./src/providers")
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large libraries
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-popover",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-switch",
            "@radix-ui/react-slider",
            "@radix-ui/react-separator",
            "@radix-ui/react-label",
            "@radix-ui/react-avatar",
            "@radix-ui/react-progress",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-slot",
            "lucide-react",
            "class-variance-authority",
            "clsx",
            "tailwind-merge"
          ],
          "vendor-forms": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-query": ["@tanstack/react-query", "@tanstack/react-query-devtools"],
          "vendor-charts": ["recharts", "chart.js", "react-chartjs-2"],
          "vendor-motion": ["framer-motion"],
          "vendor-pdf": ["jspdf", "jspdf-autotable", "html2canvas"],
          "vendor-date": ["dayjs", "date-fns", "react-datepicker", "react-day-picker"],
          "vendor-table": ["react-data-table-component"],
          "vendor-misc": [
            "axios",
            "zustand",
            "react-hot-toast",
            "sonner",
            "sweetalert2",
            "embla-carousel-react",
            "react-dropzone",
            "react-select",
            "react-intersection-observer",
            "styled-components",
            "react-to-print",
            "lodash"
          ]
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxQcm9qZWN0c1xcXFxGdXNlXFxcXFNpbXBsZUhvc3RlbFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcUHJvamVjdHNcXFxcRnVzZVxcXFxTaW1wbGVIb3N0ZWxcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1Byb2plY3RzL0Z1c2UvU2ltcGxlSG9zdGVsL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBwYXRoLCB7IGRpcm5hbWUgfSBmcm9tICdwYXRoJztcclxuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ3VybCc7XHJcbmltcG9ydCBTaXRlbWFwIGZyb20gJ3ZpdGUtcGx1Z2luLXNpdGVtYXAnO1xyXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcclxuaW1wb3J0IHZpdGVDb21wcmVzc2lvbiBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbic7XHJcblxyXG5cclxuY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgU2l0ZW1hcCh7IGhvc3RuYW1lOiAnaHR0cHM6Ly9zaW1wbGUtaG9zdGVsLnZlcmNlbC5hcHAnIH0pLFxyXG4gICAgdmlzdWFsaXplcih7IG9wZW46IGZhbHNlLCBnemlwU2l6ZTogdHJ1ZSwgYnJvdGxpU2l6ZTogdHJ1ZSwgZmlsZW5hbWU6ICdzdGF0cy5odG1sJyB9KSxcclxuICAgIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxyXG4gICAgICBleHQ6ICcuZ3onLFxyXG4gICAgfSksXHJcbiAgICB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICBhbGdvcml0aG06ICdicm90bGlDb21wcmVzcycsXHJcbiAgICAgIGV4dDogJy5icicsXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogNTE3MywgICAgICAgIC8vIEZyb250ZW5kIHBvcnQgKFZpdGUgZGVmYXVsdClcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgICAnQGNvbXBvbmVudHMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvY29tcG9uZW50cycpLFxyXG4gICAgICAnQHBhZ2VzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3BhZ2VzJyksXHJcbiAgICAgICdAc3RvcmVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3N0b3JlcycpLFxyXG4gICAgICAnQHR5cGVzJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL3R5cGVzJyksXHJcbiAgICAgICdAbGliJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjL2xpYicpLFxyXG4gICAgICAnQGFzc2V0cyc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYy9hc3NldHMnKSxcclxuICAgICAgJ0Bwcm92aWRlcnMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMvcHJvdmlkZXJzJylcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDYwMCxcclxuICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgb3V0cHV0OiB7XHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAvLyBWZW5kb3IgY2h1bmtzIC0gc3BsaXQgbGFyZ2UgbGlicmFyaWVzXHJcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxyXG4gICAgICAgICAgJ3ZlbmRvci11aSc6IFtcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXNlbGVjdCcsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdGFicycsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlcicsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtdG9vbHRpcCcsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc2Nyb2xsLWFyZWEnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWNoZWNrYm94JyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1yYWRpby1ncm91cCcsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3Qtc3dpdGNoJyxcclxuICAgICAgICAgICAgJ0ByYWRpeC11aS9yZWFjdC1zbGlkZXInLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXNlcGFyYXRvcicsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtbGFiZWwnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWF2YXRhcicsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtcHJvZ3Jlc3MnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LWFsZXJ0LWRpYWxvZycsXHJcbiAgICAgICAgICAgICdAcmFkaXgtdWkvcmVhY3QtY29sbGFwc2libGUnLFxyXG4gICAgICAgICAgICAnQHJhZGl4LXVpL3JlYWN0LXNsb3QnLFxyXG4gICAgICAgICAgICAnbHVjaWRlLXJlYWN0JyxcclxuICAgICAgICAgICAgJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eScsXHJcbiAgICAgICAgICAgICdjbHN4JyxcclxuICAgICAgICAgICAgJ3RhaWx3aW5kLW1lcmdlJ1xyXG4gICAgICAgICAgXSxcclxuICAgICAgICAgICd2ZW5kb3ItZm9ybXMnOiBbJ3JlYWN0LWhvb2stZm9ybScsICdAaG9va2Zvcm0vcmVzb2x2ZXJzJywgJ3pvZCddLFxyXG4gICAgICAgICAgJ3ZlbmRvci1xdWVyeSc6IFsnQHRhbnN0YWNrL3JlYWN0LXF1ZXJ5JywgJ0B0YW5zdGFjay9yZWFjdC1xdWVyeS1kZXZ0b29scyddLFxyXG4gICAgICAgICAgJ3ZlbmRvci1jaGFydHMnOiBbJ3JlY2hhcnRzJywgJ2NoYXJ0LmpzJywgJ3JlYWN0LWNoYXJ0anMtMiddLFxyXG4gICAgICAgICAgJ3ZlbmRvci1tb3Rpb24nOiBbJ2ZyYW1lci1tb3Rpb24nXSxcclxuICAgICAgICAgICd2ZW5kb3ItcGRmJzogWydqc3BkZicsICdqc3BkZi1hdXRvdGFibGUnLCAnaHRtbDJjYW52YXMnXSxcclxuICAgICAgICAgICd2ZW5kb3ItZGF0ZSc6IFsnZGF5anMnLCAnZGF0ZS1mbnMnLCAncmVhY3QtZGF0ZXBpY2tlcicsICdyZWFjdC1kYXktcGlja2VyJ10sXHJcbiAgICAgICAgICAndmVuZG9yLXRhYmxlJzogWydyZWFjdC1kYXRhLXRhYmxlLWNvbXBvbmVudCddLFxyXG4gICAgICAgICAgJ3ZlbmRvci1taXNjJzogW1xyXG4gICAgICAgICAgICAnYXhpb3MnLFxyXG4gICAgICAgICAgICAnenVzdGFuZCcsXHJcbiAgICAgICAgICAgICdyZWFjdC1ob3QtdG9hc3QnLFxyXG4gICAgICAgICAgICAnc29ubmVyJyxcclxuICAgICAgICAgICAgJ3N3ZWV0YWxlcnQyJyxcclxuICAgICAgICAgICAgJ2VtYmxhLWNhcm91c2VsLXJlYWN0JyxcclxuICAgICAgICAgICAgJ3JlYWN0LWRyb3B6b25lJyxcclxuICAgICAgICAgICAgJ3JlYWN0LXNlbGVjdCcsXHJcbiAgICAgICAgICAgICdyZWFjdC1pbnRlcnNlY3Rpb24tb2JzZXJ2ZXInLFxyXG4gICAgICAgICAgICAnc3R5bGVkLWNvbXBvbmVudHMnLFxyXG4gICAgICAgICAgICAncmVhY3QtdG8tcHJpbnQnLFxyXG4gICAgICAgICAgICAnbG9kYXNoJ1xyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSk7Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFpUixTQUFTLG9CQUFvQjtBQUM5UyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxRQUFRLGVBQWU7QUFDOUIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxhQUFhO0FBQ3BCLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8scUJBQXFCO0FBTjZJLElBQU0sMkNBQTJDO0FBUzFOLElBQU0sWUFBWSxRQUFRLGNBQWMsd0NBQWUsQ0FBQztBQUV4RCxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixRQUFRLEVBQUUsVUFBVSxtQ0FBbUMsQ0FBQztBQUFBLElBQ3hELFdBQVcsRUFBRSxNQUFNLE9BQU8sVUFBVSxNQUFNLFlBQVksTUFBTSxVQUFVLGFBQWEsQ0FBQztBQUFBLElBQ3BGLGdCQUFnQjtBQUFBLE1BQ2QsV0FBVztBQUFBLE1BQ1gsS0FBSztBQUFBLElBQ1AsQ0FBQztBQUFBLElBQ0QsZ0JBQWdCO0FBQUEsTUFDZCxXQUFXO0FBQUEsTUFDWCxLQUFLO0FBQUEsSUFDUCxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsV0FBVyxPQUFPO0FBQUEsTUFDcEMsZUFBZSxLQUFLLFFBQVEsV0FBVyxrQkFBa0I7QUFBQSxNQUN6RCxVQUFVLEtBQUssUUFBUSxXQUFXLGFBQWE7QUFBQSxNQUMvQyxXQUFXLEtBQUssUUFBUSxXQUFXLGNBQWM7QUFBQSxNQUNqRCxVQUFVLEtBQUssUUFBUSxXQUFXLGFBQWE7QUFBQSxNQUMvQyxRQUFRLEtBQUssUUFBUSxXQUFXLFdBQVc7QUFBQSxNQUMzQyxXQUFXLEtBQUssUUFBUSxXQUFXLGNBQWM7QUFBQSxNQUNqRCxjQUFjLEtBQUssUUFBUSxXQUFXLGlCQUFpQjtBQUFBLElBQ3pEO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsdUJBQXVCO0FBQUEsSUFDdkIsY0FBYztBQUFBLElBQ2QsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBO0FBQUEsVUFFWixnQkFBZ0IsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsVUFDekQsYUFBYTtBQUFBLFlBQ1g7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsVUFDQSxnQkFBZ0IsQ0FBQyxtQkFBbUIsdUJBQXVCLEtBQUs7QUFBQSxVQUNoRSxnQkFBZ0IsQ0FBQyx5QkFBeUIsZ0NBQWdDO0FBQUEsVUFDMUUsaUJBQWlCLENBQUMsWUFBWSxZQUFZLGlCQUFpQjtBQUFBLFVBQzNELGlCQUFpQixDQUFDLGVBQWU7QUFBQSxVQUNqQyxjQUFjLENBQUMsU0FBUyxtQkFBbUIsYUFBYTtBQUFBLFVBQ3hELGVBQWUsQ0FBQyxTQUFTLFlBQVksb0JBQW9CLGtCQUFrQjtBQUFBLFVBQzNFLGdCQUFnQixDQUFDLDRCQUE0QjtBQUFBLFVBQzdDLGVBQWU7QUFBQSxZQUNiO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
