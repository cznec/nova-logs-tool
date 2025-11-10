import Tool from './pages/Tool.vue'
import '../css/tool.css'

Nova.booting((app, store) => {
    Nova.inertia('NovaLogs', Tool);
});
