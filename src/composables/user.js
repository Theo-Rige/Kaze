import { reactive } from 'vue'
import axios from 'axios'

const token = localStorage.getItem('jwt')
const user_local = JSON.parse(localStorage.getItem('user'))

export async function useUser() {
	const { data } = await axios.get('http://kaze.theorige.com/api/users/' + user_local.id + '?populate=*', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})
	const user = reactive(data.data)
	return user
}
