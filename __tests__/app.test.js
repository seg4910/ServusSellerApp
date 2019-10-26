import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import AccountView from '../components/views/appViews/AccountView';
import CategoryCard from '../components/views/appViews/CategoryCard';
import HomeView from '../components/views/appViews/HomeView';
import ServiceView from '../components/views/appViews/ServiceView';

import Account from '../components/Account';
import CreateLocation from '../components/CreateLocation';
import CreateService from '../components/CreateService';
import EditAcountInfo from '../components/EditAcountInfo';
import Home from '../components/Home';
import Service from '../components/Service';
import ServicePreview from '../components/ServicePreview';
import ViewOrders from '../components/ViewOrders';

const navigation = {
  navigate: Function.prototype,
  setParams: Function.prototype,
  dispatch: Function.prototype,
  getParam: (param, defaultValue) => {
    return defaultValue
  },
}

// UI Tests
it('UI Test: AccountView: snapshot renders correctly', () => {
  // TODO: react-native-image-picker is making this fail
  const tree = renderer
    .create(<AccountView />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
it('UI Test: CategoryCard: snapshot renders correctly', () => {
  const tree = renderer
    .create(<CategoryCard />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
it('UI Test: HomeView: snapshot renders correctly', () => {
  const tree = renderer
    .create(<HomeView navigation={navigation} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
it('UI Test: ServiceView: snapshot renders correctly', () => {
  const tree = renderer
    .create(<ServiceView />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

// Component Tests
describe("Account Test", () => {
  it('Component Test: SignIn: renders correctly', () => {
    renderer.create(<Account navigation={navigation} />);   // no compile-time error
  });
});
describe("CreateLocation", () => {
  it('Component Test: CreateLocation: renders correctly', () => {
    renderer.create(<CreateLocation />);
  });
});
describe("CreateService", () => {
  it('Component Test: CreateService: renders correctly', () => {
    renderer.create(<CreateService />);
  });
});
describe("Edit Account Info", () => {
  it('Component Test: SignIn: renders correctly', () => {
    renderer.create(<EditAcountInfo />);
  });
});
describe("Service", () => {
  it('Component Test: Service: renders correctly', () => {
    renderer.create(<Service navigation={navigation} />);
  });
});
describe("ServicePreview", () => {
  it('Component Test: ServicePreview: renders correctly', () => {
    renderer.create(<ServicePreview navigation={navigation} />);
  });
});
describe("ViewOrders", () => {
  it('Component Test: View Orders: renders correctly', () => {
    renderer.create(<ViewOrders navigation={navigation} />);
  });
});
