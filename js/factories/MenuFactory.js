class MenuFactory {
    static createMenu(type, map) {
        switch (type.toLowerCase()) {
            case "airplane":
                return new AirplaneContextMenu(map);
            case "radar":
                return new RadarContextMenu(map);
            case "reconnoissance":
                return new ReconnoissanceContextMenu(map);
            case "jamming":
                return new JammingContextMenu(map);
            default:
                throw new Error("Unknown menu type: ${type}");
        }
    }
}