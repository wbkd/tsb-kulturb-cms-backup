import React, { PureComponent, Fragment } from 'react';
import { SimpleOpeningHours } from 'simple-opening-hours';
import { Button, Input } from 'antd';
import OpeningHoursPreview from '~/components/OpeningHoursPreview';
import OpeningHoursTimePicker from './components/TimePicker';


class OpeningHoursInput extends PureComponent {
  state = {
    isPreviewOpen: false,
    isPickerOpen: false,
    openingHours: ''
  }

  componentDidMount() {
    const { initialValue } = this.props;
    if (initialValue) {
      this.setState({ openingHours: initialValue });
    }
  }

  togglePreview() {
    this.setState(({ isPreviewOpen }) => ({ isPreviewOpen: !isPreviewOpen }));
  }

  togglePicker() {
    this.setState(({ isPickerOpen }) => ({ isPickerOpen: !isPickerOpen }));
  }

  onChangeOpeningHours(openingHours) {
    this.props.form.setFieldsValue({ openingHours });
    this.setState({ openingHours });
  }

  render() {
    const { isPreviewOpen, isPickerOpen, openingHours } = this.state;
    const { form, initialValue } = this.props;
    const openingHoursTable = new SimpleOpeningHours(openingHours).getTable();

    return (
      <Fragment>
        {form.getFieldDecorator('openingHours', { initialValue })(
          <Input />
        )}
        <Button onClick={() => this.togglePicker()}>
          Hilfe
        </Button>
        <OpeningHoursTimePicker
          visible={isPickerOpen}
          onChangeOpeningHours={res => this.onChangeOpeningHours(res)}
          onClose={() => this.togglePicker()}
        />
        <Button onClick={() => this.togglePreview()}>
          <span>
            Vorschau {isPreviewOpen ? 'ausblenden' : 'anzeigen'}
          </span>
        </Button>
        {isPreviewOpen && <OpeningHoursPreview openingHours={openingHoursTable} />}
      </Fragment>
    );
  }
}

export default OpeningHoursInput;
