class AirplaneFactory {
    static createAirplane(type, map, position, icon, contextMenu) {
        switch (type.toLowerCase()) {
            case 'fighterjet':
                return new FighterJet(map, position, icon, contextMenu);
            case 'passengerplane':
                return new PassengerPlane(map, position, icon, contextMenu);
            default:
                throw new Error("Unknown airplane type: ${type}");
        }
    }
}
