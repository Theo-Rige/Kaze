import { reactive } from 'vue'

export function useToast() {
	const toast = reactive({
		state: false,
		notice: '',
		type: '',
		set(notice, type = 'info', duration = 2000) {
			this.state = true
			this.notice = notice
			this.type = type
			if (duration != false) {
				return new Promise((resolve) =>
					setTimeout(() => {
						this.state = false
						this.notice = ''
						this.type = ''
						resolve()
					}, duration)
				)
			}
		},
	})

	return toast
}
