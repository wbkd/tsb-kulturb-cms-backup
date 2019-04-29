import React, { PureComponent } from 'react';
import {
  Form, Input, Icon, Row, Col, Button, Spin, Modal, notification
} from 'antd';
import Select from 'react-select';
import randomize from 'randomatic';

import { Link } from 'react-router-dom';
import Container from '~/components/Container';
import HeaderArea from '~/components/HeaderArea';
import FormItem from '~/components/FormItem';
import StyledButton from '~/components/Button';

import history from '~/history';
import {
  findById, create, update, remove
} from '~/services/userApi';
import { get } from '~/services/locationApi';

function renderError() {
  return (
    <Container>
      <h1>Nutzer Fehler</h1>
      Der gesuchte Nutzer konnte nicht gefunden werden.

      <div style={{ marginTop: '15px' }}>
        <Button>
          <Link to="/">Zurück zur Übersicht</Link>
        </Button>
      </div>
    </Container>
  );
}

function renderSuccessMessage() {
  return notification.success({
    message: 'Erfolgreich gespeichert.'
  });
}

function renderErrorMessage(res) {
  let message = 'Ein Fehler ist aufgetreten. Versuchen Sie erneut.';
  if (res.message === 'Already Registered') {
    message = 'Email Addresse bereits vergeben';
  }
  return notification.error({ message });
}

class User extends PureComponent {
  state = {
    item: {},
    isLoading: true,
    isDeleteModalVisible: false,
    isError: false,
    showPassword: false,
    password: randomize('A0!', 14),
    locations: []
  }

  constructor(props) {
    super();

    this.isCreateMode = props.isCreateMode;
  }

  async componentDidMount() {
    const { data: locations } = await get({ limit: 0, fields: ['_id', 'name'] });

    if (this.props.isCreateMode) {
      return this.setState({ isLoading: false, locations });
    }

    const { id } = this.props.match.params;
    const item = await findById(id);

    if (!item) {
      return this.setState({ isError: true, isLoading: false });
    }

    this.setState({
      item,
      isLoading: false,
      locations
    });
  }

  onSubmit(evt, redirect) {
    const { form, match } = this.props;
    evt.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        if (values.confirmPassword) {
          delete values.confirmPassword;
        }

        if (this.isCreateMode) {
          this.isCreateMode = false;
          const res = await create(values);
          if (!res.id) return renderErrorMessage(res);
          history.replace(`/nutzer/${res.id}`);
          renderSuccessMessage();
          form.setFieldsValue({ ...res, password: '', confirmPassword: '' });
          return this.setState({ item: res });
        }

        const res = await update(match.params.id, values);
        if (!res.id) return renderErrorMessage();
        this.setState({ item: res });
        renderSuccessMessage();

        if (redirect) {
          history.push(redirect);
        }
      }
    });
  }

  onOpenModal(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    this.setState({
      isDeleteModalVisible: true
    });
  }

  async onOk() {
    await remove(this.props.match.params.id);
    this.closeModal();

    history.push('/nutzer');
  }

  onCancel() {
    this.closeModal();
  }

  closeModal() {
    this.setState({
      isDeleteModalVisible: false
    });
  }

  async selectLocation(organisation) {
    this.setState(({ item }) => ({
      item: {
        organisation,
        ...item
      }
    }));
  }

  togglePasswordVisibility() {
    this.setState(({ showPassword }) => ({ showPassword: !showPassword }));
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Passworter sind unterschiedlich!');
    } else {
      callback();
    }
  }

  render() {
    const { isCreateMode, form, formItemLayout } = this.props;
    const {
      isLoading,
      item,
      locations,
      isDeleteModalVisible,
      showPassword,
      password
    } = this.state;
    const title = isCreateMode ? 'anlegen' : 'bearbeiten';

    if (this.state.isError) {
      return renderError();
    }

    return (
      <Container>
        <HeaderArea>
          <h1>Nutzer {title}</h1>
        </HeaderArea>
        {isLoading ? <Spin /> : (
          <Form onSubmit={evt => this.onSubmit(evt)} layout="horizontal">
            <FormItem
              key="email"
              label="Email"
              {...formItemLayout}
            >
              {form.getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'Ungültige Email Addresse',
                }, {
                  required: true, message: 'Email ist erforderlich',
                }],
                initialValue: item.email
              })(
                <Input />
              )}
            </FormItem>

            <FormItem
              key="password"
              label="Password"
              {...formItemLayout}
            >
              {form.getFieldDecorator('password', {
                initialValue: isCreateMode && password,
                rules: [{
                  required: isCreateMode, message: 'Bitte password eingeben!',
                }]
              })(
                <Input
                  type={showPassword ? 'text' : 'password'}
                  prefix={<Icon type="eye" onClick={() => this.togglePasswordVisibility()} />}
                />
              )}
            </FormItem>

            <FormItem
              key="confirmPassword"
              label="Password wiederholen"
              {...formItemLayout}
            >
              {form.getFieldDecorator('confirmPassword', {
                initialValue: isCreateMode && password,
                rules: [{
                  required: form.isFieldTouched('password'), message: 'Bitte password bestätigen!',
                }, {
                  validator: this.compareToFirstPassword,
                }]
              })(
                <Input
                  type={showPassword ? 'text' : 'password'}
                  prefix={<Icon type="eye" onClick={() => this.togglePasswordVisibility()} />}
                />
              )}
            </FormItem>

            <FormItem
              key="organisation"
              label="Kulturort"
              {...formItemLayout}
            >
              {form.getFieldDecorator('organisation', {
                initialValue: item.organisation && { _id: item.organisation.id, name: item.organisation.name },
                rules: [{
                  required: true
                }]
              })(
                <Select
                  placeholder="Kulturort auswählen..."
                  noOptionsMessage={() => 'Keinen Kulturort gefunden'}
                  onChange={({ label, value }) => this.selectLocation(value)}
                  options={locations}
                  getOptionValue={option => option.id}
                  getOptionLabel={option => option.name}
                  defaultValue={item.organisation && { _id: item.organisation.id, name: item.organisation.name }}
                  isClearable={!!item.organisation}
                  isSearchable
                />
              )}
            </FormItem>

            <Row style={{ marginTop: '15px' }}>
              <Col span={17} style={{ textAlign: 'right' }}>
                <StyledButton type="primary" htmlType="submit" style={{ marginLeft: '5px' }}>
                  Speichern
                </StyledButton>
                {!isCreateMode && (
                  <StyledButton
                    type="danger"
                    icon="delete"
                    onClick={evt => this.onOpenModal(evt)}
                    style={{ marginLeft: '5px' }}
                  >
                    Nutzer löschen
                  </StyledButton>
                )}
              </Col>
            </Row>
          </Form>
        )}
        <Modal
          title="Eintrag löschen"
          visible={isDeleteModalVisible}
          onOk={() => this.onOk()}
          onCancel={() => this.onCancel()}
        >
          <p>
            Sind Sie sicher, dass sie den Eintrag
            <strong> {item.name} </strong>
            löschen wollen?
          </p>
        </Modal>
      </Container>
    );
  }
}

const WrappedUser = Form.create({ name: 'user' })(User);

export default WrappedUser;
