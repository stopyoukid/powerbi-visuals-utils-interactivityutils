/// <reference types="d3" />
declare module powerbi.extensibility.utils.filter {
    interface AppliedFilter {
        whereItems: {
            condition: any;
        }[];
    }
    interface Expression {
        left: Expression;
        right: Expression;
    }
    type BasicFilterOperators = "In" | "NotIn" | "All";
    enum SQExprKind {
        Entity = 0,
        SubqueryRef = 1,
        ColumnRef = 2,
        MeasureRef = 3,
        Aggregation = 4,
        PropertyVariationSource = 5,
        Hierarchy = 6,
        HierarchyLevel = 7,
        And = 8,
        Between = 9,
        In = 10,
        Or = 11,
        Contains = 12,
        Compare = 13,
        StartsWith = 14,
        Exists = 15,
        Not = 16,
        Constant = 17,
        DateSpan = 18,
        DateAdd = 19,
        Now = 20,
        AnyValue = 21,
        DefaultValue = 22,
        Arithmetic = 23,
        FillRule = 24,
        ResourcePackageItem = 25,
        ScopedEval = 26,
        WithRef = 27,
        Percentile = 28,
        SelectRef = 29,
        TransformTableRef = 30,
        TransformOutputRoleRef = 31,
        ThemeDataColor = 32,
        GroupRef = 33,
        Floor = 34,
        RoleRef = 35,
        Discretize = 36,
        NamedQueryRef = 37,
        Member = 38,
        FilteredEval = 39,
        Conditional = 40,
    }
    enum QueryComparisonKind {
        Equal = 0,
        GreaterThan = 1,
        GreaterThanOrEqual = 2,
        LessThan = 3,
        LessThanOrEqual = 4,
        Contains = 12,
        Is = 13,
        StartsWith = 14,
        DoesNotContain = 16,
    }
    interface AppliedFilter {
        whereItems: {
            condition: any;
        }[];
    }
}
declare module powerbi.extensibility.utils.filter {
    class FilterManager {
        static restoreSelectionIds(filter: AppliedFilter): visuals.ISelectionId[];
        static restoreFilter(filter: AppliedFilter): IFilter;
        private static restoreAdvancedFilter(expr);
        private static restoreBasicFilter(expr);
        private static getConditions(exprs);
        private static getValue(expr);
        static getCondition(expr: any): IAdvancedFilterCondition;
        private static getBasicFilterOperator(kind);
        private static getLogicalOperatorNameByKind(kind);
        private static getCondictionOperatorByComparison(comparison);
    }
}
declare module powerbi.extensibility.utils.interactivity {
    import IVisualHost = powerbi.extensibility.visual.IVisualHost;
    import ExtensibilityISelectionId = powerbi.extensibility.ISelectionId;
    import ISelectionId = powerbi.visuals.ISelectionId;
    import BoundingRect = powerbi.extensibility.utils.svg.shapes.BoundingRect;
    interface SelectableDataPoint {
        selected: boolean;
        /** Identity for identifying the selectable data point for selection purposes */
        identity: ExtensibilityISelectionId;
        /**
         * A specific identity for when data points exist at a finer granularity than
         * selection is performed.  For example, if your data points should select based
         * only on series even if they exist as category/series intersections.
         */
        specificIdentity?: ExtensibilityISelectionId;
    }
    /**
     * Factory method to create an IInteractivityService instance.
     */
    function createInteractivityService(hostServices: IVisualHost): IInteractivityService;
    /**
    * Creates a clear an svg rect to catch clear clicks.
    */
    function appendClearCatcher(selection: d3.Selection<any>): d3.Selection<any>;
    function dataHasSelection(data: SelectableDataPoint[]): boolean;
    interface IInteractiveBehavior {
        bindEvents(behaviorOptions: any, selectionHandler: ISelectionHandler): void;
        renderSelection(hasSelection: boolean): void;
        hoverLassoRegion?(e: MouseEvent, rect: BoundingRect): void;
        lassoSelect?(e: MouseEvent, rect: BoundingRect): void;
    }
    /**
     * An optional options bag for binding to the interactivityService
     */
    interface InteractivityServiceOptions {
        isLegend?: boolean;
        isLabels?: boolean;
        overrideSelectionFromData?: boolean;
        hasSelectionOverride?: boolean;
    }
    /**
     * Responsible for managing interactivity between the hosting visual and its peers
     */
    interface IInteractivityService {
        /** Binds the visual to the interactivityService */
        bind(dataPoints: SelectableDataPoint[], behavior: IInteractiveBehavior, behaviorOptions: any, iteractivityServiceOptions?: InteractivityServiceOptions): any;
        /** Clears the selection */
        clearSelection(): void;
        /** Sets the selected state on the given data points. */
        applySelectionStateToData(dataPoints: SelectableDataPoint[], hasHighlights?: boolean): boolean;
        /** Checks whether there is at least one item selected */
        hasSelection(): boolean;
        /** Checks whether there is at least one item selected within the legend */
        legendHasSelection(): boolean;
        /** Checks whether the selection mode is inverted or normal */
        isSelectionModeInverted(): boolean;
        /** Apply new selections to change internal state of interactivity service from filter */
        applySelectionFromFilter(appliedFilter: filter.AppliedFilter): void;
        /** Apply new selections to change internal state of interactivity service */
        restoreSelection(selectionIds: ISelectionId[]): void;
    }
    interface ISelectionHandler {
        /**
         * Handles a selection event by selecting the given data point.  If the data point's
         * identity is undefined, the selection state is cleared. In this case, if specificIdentity
         * exists, it will still be sent to the host.
         */
        handleSelection(dataPoints: SelectableDataPoint | SelectableDataPoint[], multiSelect: boolean): void;
        /** Handles a selection clear, clearing all selection state */
        handleClearSelection(): void;
        /**
         * Sends the selection state to the host
         */
        applySelectionFilter(): void;
    }
    class InteractivityService implements IInteractivityService, ISelectionHandler {
        private selectionManager;
        private renderSelectionInVisual;
        private renderSelectionInLegend;
        private renderSelectionInLabels;
        private selectedIds;
        private isInvertedSelectionMode;
        private hasSelectionOverride;
        private behavior;
        selectableDataPoints: SelectableDataPoint[];
        selectableLegendDataPoints: SelectableDataPoint[];
        selectableLabelsDataPoints: SelectableDataPoint[];
        constructor(hostServices: IVisualHost);
        /** Binds the visual to the interactivityService */
        bind(dataPoints: SelectableDataPoint[], behavior: IInteractiveBehavior, behaviorOptions: any, options?: InteractivityServiceOptions): void;
        private clearSelectedIds();
        /**
         * Sets the selected state of all selectable data points to false and invokes the behavior's select command.
         */
        clearSelection(): void;
        applySelectionStateToData(dataPoints: SelectableDataPoint[], hasHighlights?: boolean): boolean;
        /**
         * Apply new selections to change internal state of interactivity service from filter
         */
        applySelectionFromFilter(appliedFilter: filter.AppliedFilter): void;
        /**
         * Apply new selections to change internal state of interactivity service
         */
        restoreSelection(selectionIds: ISelectionId[]): void;
        /**
         * Checks whether there is at least one item selected.
         */
        hasSelection(): boolean;
        legendHasSelection(): boolean;
        labelsHasSelection(): boolean;
        isSelectionModeInverted(): boolean;
        applySelectionFilter(): void;
        handleSelection(dataPoints: SelectableDataPoint | SelectableDataPoint[], multiSelect: boolean): void;
        handleClearSelection(): void;
        /**
         * Syncs the selection state for all data points that have the same category. Returns
         * true if the selection state was out of sync and corrections were made; false if
         * the data is already in sync with the service.
         *
         * If the data is not compatible with the current service's current selection state,
         * the state is cleared and the cleared selection is sent to the host.
         *
         * Ignores series for now, since we don't support series selection at the moment.
         */
        syncSelectionState(): void;
        private syncSelectionStateInverted();
        private renderAll();
        /** Marks a data point as selected and syncs selection with the host. */
        private select(dataPoints, multiSelect);
        private selectSingleDataPoint(dataPoint, shouldDataPointBeSelected);
        private removeId(toRemove);
        private sendSelectionToHost();
        private takeSelectionStateFromDataPoints(dataPoints);
        private applyToAllSelectableDataPoints(action);
        private static updateSelectableDataPointsBySelectedIds(selectableDataPoints, selectedIds);
        private static isDataPointSelected(dataPoint, selectedIds);
        private removeSelectionIdsWithOnlyMeasures();
        private removeSelectionIdsExceptOnlyMeasures();
    }
}
declare module powerbi.extensibility.utils.interactivity {
    import IPoint = powerbi.extensibility.utils.svg.shapes.IPoint;
    module interactivityUtils {
        function getPositionOfLastInputEvent(): IPoint;
        function registerStandardSelectionHandler(selection: d3.Selection<any>, selectionHandler: ISelectionHandler): void;
        function registerGroupSelectionHandler(group: d3.Selection<any>, selectionHandler: ISelectionHandler): void;
    }
}
