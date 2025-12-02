import { useAppState } from '../context/AppStateContext';

export const useNavigation = () => {
  const { screen, setScreen } = useAppState();

  const goToCheckIn = () => setScreen('checkin');
  const goToMap = () => setScreen('map');
  const goToLar = () => setScreen('lar');

  return {
    screen,
    navigate: setScreen,
    goToCheckIn,
    goToMap,
    goToLar
  };
};
