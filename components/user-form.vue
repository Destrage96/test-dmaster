<template>
  <div class="user-form__container">
    <Form ref="userForm"
          :model="formModel">
      <Row>
        <Col span="24">
          <FormItem label="Имя" prop="name">
            <Input v-model.trim="formModel.name" />
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <FormItem label="Статус" prop="isActive">
            <i-switch v-model="formModel.isActive" true-color="#13ce66" false-color="#ff4949" />
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <FormItem label="Возраст" prop="age">
            <Input v-model.trim="formModel.age" />
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <FormItem label="Email" prop="email">
            <Input v-model.trim="formModel.email" />
          </FormItem>
        </Col>
      </Row>

      <Row>
        <Col span="24">
          <FormItem label="Телефон" prop="phone">
            <Input v-model.trim="formModel.phone"/>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <Row type="flex">
      <Col>
        <div class="no-margin">
          <Button type="primary"
                  @click="onSubmitForm()"
                  @keyup.native.enter="onSubmitForm()">
            <span>Сохранить</span>
          </Button>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {mixinEventId} from '~/lib/mixins/event-ids';

  export default {
    name: "user-form",

    mixins: [mixinEventId],

    mounted() {
      this.$refs['userForm'].resetFields();
    },

    data: function () {
      return {
        stateToReadonly: false,
        formModel: {
          name: '',
          isActive: false,
          age: 0,
          email: '',
          phone: '',
        }
      }
    },

    methods: {
      async save() {
        try {
          await this.$api.users.save({
            data: {
              name: this.formModel.name,
              isActive: this.formModel.email,
              age: this.formModel.age,
              email: this.formModel.email,
              phone: this.formModel.phone,
              registered: Date.parse(new Date()),
            }
          });

          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'success',
            text: 'Пользователь успешно добавлен.'
          })

          this.$emit('on-save', false);
        } catch (e) {

          this.$root.$emit(this.EVENT_ID_ALERT_SHOW, {
            type: 'error',
            text: 'Не удалось добавит нового пользователя, повторите попытку позже.'
          })
        } finally {
          this.$refs['userForm'].resetFields();
        }
      },

      onSubmitForm() {
        this.save();
      }
    }
  }
</script>
