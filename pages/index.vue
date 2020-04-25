<template>
  <div class="users-list__container">
    <h1 class="page-title">Список пользователей</h1>
    <Row type="flex"
         justify="end"
         style="margin-bottom: 30px">
      <Col>
        <Button type="primary" @click="$_onAdd">
          <font-awesome-icon fas icon="plus"/>
        </Button>
      </Col>
    </Row>

    <Table border
           :loading="isLoading"
           :columns="titles"
           :data="users"
           size="default"
           class="users-table"
           stripe
           no-data-text="Нет данных">

      <template slot-scope="{row}" slot="name">
        <span v-if="readonly">{{row.name}}</span>
        <Input v-else
               style="width: auto"
               v-model="row.name" />
      </template>

      <template slot-scope="{row}" slot="isActive">
        <span v-if="readonly">{{row.isActive}}</span>
        <i-switch v-model="row.isActive"
                  v-else
                  true-color="#13ce66"
                  false-color="#ff4949" />
      </template>

      <template slot-scope="{row}" slot="age">
        <span v-if="readonly">{{row.age}}</span>
        <Input v-else v-model="row.age"/>
      </template>

      <template slot-scope="{row}" slot="email">
        <span v-if="readonly">{{row.email}}</span>
        <Input v-else v-model="row.email"/>
      </template>

      <template slot-scope="{row}" slot="phone">
        <span v-if="readonly">{{row.phone}}</span>
        <Input v-else v-model="row.phone"/>
      </template>

      <template slot-scope="{row}" slot="registered">
        <span v-if="readonly">{{$_onChangeDate(row.registered)}}</span>
        <DatePicker type="date"
                    :value="unixTimeToString(row.registered)"
                    @on-change="$_onChangeDate(row.registered)"
                    v-model="row.registered"
                    v-else
                    :editable="false"
                    style="width: 200px" />
      </template>

      <template slot-scope="{index, row}" slot="actions">
        <div>
          <a @click="$_onEdit(index, row)" style="margin-right: 15px">
            <Tooltip content="Редактирование" placement="bottom-end">
              <font-awesome-icon fas icon="edit"/>
            </Tooltip>
          </a>

          <a @click="$_onDelete(index, row)">
            <Tooltip :content="'Удаление контакта'"
                     placement="bottom-end">
              <font-awesome-icon
                style="color: red"
                fas icon="trash-alt"/>
            </Tooltip>
          </a>
        </div>
      </template>
    </Table>

    <Row type="flex" justify="space-between" :gutter="16" style="margin-top: 15px;">
      <Col span="18">
        <Page size="small"
              :total="total"
              @on-change="onPageChange" :class="{'d-none': isLoading}"/>
      </Col>
    </Row>

    <Drawer width="400" v-model="showForm" @on-close="showForm = false">
      <UserForm @on-save="$_onSave"/>
    </Drawer>
  </div>
</template>

<script>
  import UserForm from '../components/user-form';
  import {mixinEventId} from '../lib/mixins/event-ids';
  import * as moment from 'moment';

  export default {
    layout: 'default',

    components: {UserForm},

    mixins: [mixinEventId],

    mounted() {
      this.fetchUsersList();
    },
    data() {
      return {
        isLoading: false,
        readonly: true,
        onSelectedUser: {},
        users: [],
        total: 0,
        page: 1,
        showForm: false
      }
    },
    computed: {
      titles() {
        let titles = [];
        titles.push(
          {title: 'Имя', slot: 'name', minWidth: 200},
          {title: 'Статус', slot: 'isActive', minWidth: 90, align: 'center'},
          {title: 'Возраст', slot: 'age', minWidth: 90, align: 'center'},
          {title: 'Email', slot: 'email', minWidth: 200},
          {title: 'Телефон', slot: 'phone', minWidth: 200},
          {title: 'Дата рег.', slot: 'registered', minWidth: 200},
          {title: 'Действия', slot: 'actions', width: '120px', align: 'center', minWidth: 200},
        );
        return titles;
      }
    },
    methods: {
      async fetchUsersList() {
        this.isLoading = true;
        try {
          let users = await this.$api.users.fetchList({page: this.page});
          this.users = users.list;
          this.total = users.total;
        } catch (e) {
          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'error',
            text: 'Ошибка загрузки данных'
          })
        } finally {
          this.isLoading = false;
        }
      },

      async $_onDelete(index, row) {
        try {
          await this.$api.users.delete(row.id);
          await this.fetchUsersList();
          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'success',
            text: 'Пользователь успешно удалён.',
          })
        } catch (e) {
          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'error',
            text: 'Не удалось удалить пользователя, повторите попытку позже.'
          })
        }
      },

      $_onEdit(index, row) {
        this.readonly = false;
      },

      $_onAdd() {
        this.showForm = true;
      },

      async $_onSave(isEdit) {
        await this.fetchUsersList();
        this.showForm = isEdit;
      },

      async onPageChange(page) {
        this.page = page;
        await this.fetchUsersList();
      },

      unixTimeToString(t) {
        return moment.unix(t / 1000).format('DD-MM-YYYY');
      },

      $_onChangeDate(q) {
        if(typeof q === "number") {
          return this.unixTimeToString(q)
        } else {
          return Date.parse(q);
        }
      }
    }
  }
</script>

<style lang="less">
  .users-list__container {
    .users-table {
      .ivu-input {
        border: none;
        background-color: rgba(245, 245, 245, 0);
        &:focus {
          border: none;
          box-shadow: none;
        }
      }
    }
  }
</style>

