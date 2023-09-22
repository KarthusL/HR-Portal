import { createFeatureSelector, createSelector } from '@ngrx/store';
import { HousingState } from '../reducers/hr-housing.reducers';

export const selectHousingState = createFeatureSelector<HousingState>('housing');

export const selectSelectedHouse = createSelector(
  selectHousingState,
  (state: HousingState) => state.selectedHouse
);

export const selectHouses = createSelector(
  selectHousingState,
  (state: HousingState) => state.houses
)

export const selectEmployeeHouse = createSelector(
  selectHousingState,
  (state: HousingState) => state.employeeHouse
)