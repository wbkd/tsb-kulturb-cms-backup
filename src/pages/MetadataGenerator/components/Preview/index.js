import React, { PureComponent } from 'react';
import styled from 'styled-components';
import {
  Card, Divider
} from 'antd';

const { Meta } = Card;

const StyledCard = styled(Card)`
  margin: 20px !important;
`;

class MetadataPreview extends PureComponent {
  render() {
    return (
      <StyledCard
        hoverable
        cover={this.props.logo && (<img alt="logo" src={this.props.logo.url} />)}
      >
        {this.props.tags
          && this.props.tags.map(tag => <p>{tag.name}</p>)}
        <Meta
          title={this.props.name}
          description={this.props.address}
        />
        <p>{this.props.description}</p>
        <Divider />
        <p>Website: {this.props.website}</p>
        <p>Telefonnummer: {this.props.telephone}</p>
        <p>Öffnungszeiten: {this.props.openingHours}</p>
      </StyledCard>
    );
  }
}

export default MetadataPreview;
