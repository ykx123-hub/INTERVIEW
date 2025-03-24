import { createRouter, createWebHistory } from 'vue-router'
import ArrangeView from "@/views/ArrangeView.vue";
import RoomInfoView from "@/views/RoomInfoView.vue";
import ChangeView from "@/views/ChangeView.vue";

const routes = [
    {
        path: '/arrange',
        name: 'Arrange',
        component: ArrangeView
    },
    {
        path: '/room_info',
        name: 'RoomInfo',
        component: RoomInfoView
    },
    {
        path: '/change',
        name: 'Change',
        component: ChangeView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
