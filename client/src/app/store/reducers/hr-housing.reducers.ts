import { createReducer, on, combineReducers } from '@ngrx/store';
import { showHouseDetails, updateHouses, updateEmployeeHouse } from '../actions/hr-housing.actions';
import { Housing } from 'src/app/models/housing.interface';

export interface HousingState {
  selectedHouse: Housing | null,
  houses: Housing[],
  employeeHouse: Housing | null
};

export const initialHousingState: HousingState = {
  selectedHouse: null,
  houses: [],
  employeeHouse: null
};

export const housingReducer = createReducer(
  initialHousingState,
  on(showHouseDetails, (state, { houseId }) => ({
    ...state,
    selectedHouse: state.houses.find(house => house._id === houseId) || null,
  })),
  on(updateHouses, (state, { houses }) => ({
    ...state,
    houses: houses
  })),
  on(updateEmployeeHouse, (state, { house }) => ({
    ...state,
    employeeHouse: house
  }))
);

