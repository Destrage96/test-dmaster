export default $axios => ({
    async fetchList({page}) {
        try {
            let sort = Date.parse(new Date());
            let total = await $axios.$get('list');
            const list = await $axios.$get('list?_sort=registered&_order=DESC' + '&_page=' + page + '&_limit=' + 10);
            if (typeof (list) === 'object') {
                return {
                    list: Object.values(list),
                    total: Object.values(total).length
                };
            }
            return null;
        } catch (error) {
            throw error;
        }
    },

    async getUser(user) {
        try {
            let user = await $axios.$get('list/' + user);
            return user;
        } catch (error) {
            throw error;
        }
    },

    async save(data) {
        try {
            await $axios.$post('list', Object.values(data)[0]);
        } catch (error) {
            throw error;
        }
    },

    async edit(form) {
        const user = {
            id: form.id,
            registered: Date.parse(form.registered),
            name: form.name,
            phone: form.phone,
            email: form.email,
            age: form.age,
            isActive: form.isActive
        }
        try {
            await $axios.$patch('list/' + user.id, user);
        } catch (error) {
            throw error;
        }
    },

    async delete(user) {
        try {
            await $axios.$delete('list/' + user);
        } catch (error) {
            throw(error);
        }
    }
});
