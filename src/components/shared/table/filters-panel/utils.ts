import {
  FilterConfig,
  Filters,
  RangeFilterValue,
} from "../types";

export function getRangeFilterValue<T>(
  filters: Filters<T>,
  key: keyof T
): RangeFilterValue {
  const value = filters[key];

  if (typeof value === "object" && value !== null) {
    return value as RangeFilterValue;
  }

  return {};
}

export function isFilterActive<T>(
  config: FilterConfig<T>,
  filters: Filters<T>
) {
  const value = filters[config.key];

  if (config.type === "select") {
    return value !== "" && value !== undefined && value !== null;
  }

  const rangeValue = getRangeFilterValue(filters, config.key);

  return (
    (rangeValue.min !== "" &&
      rangeValue.min !== undefined &&
      rangeValue.min !== null) ||
    (rangeValue.max !== "" &&
      rangeValue.max !== undefined &&
      rangeValue.max !== null)
  );
}

export function buildExpandedMap<T>(
  filtersConfig: FilterConfig<T>[],
  filters: Filters<T>
) {
  const expandedMap = filtersConfig.reduce<Record<string, boolean>>(
    (accumulator, config, index) => {
      accumulator[String(config.key)] =
        isFilterActive(config, filters) || index === 0;
      return accumulator;
    },
    {}
  );

  expandedMap.__sort__ = true;

  return expandedMap;
}

export function getFilterSummary<T>(
  config: FilterConfig<T>,
  filters: Filters<T>
) {
  const value = filters[config.key];

  if (config.type === "select") {
    if (value === "" || value === undefined || value === null) {
      return `All ${config.label}`;
    }

    const option = config.options?.find(
      (item) => String(item.value) === String(value)
    );
    return option?.label ?? String(value);
  }

  const rangeValue = getRangeFilterValue(filters, config.key);
  const hasMin =
    rangeValue.min !== "" &&
    rangeValue.min !== undefined &&
    rangeValue.min !== null;
  const hasMax =
    rangeValue.max !== "" &&
    rangeValue.max !== undefined &&
    rangeValue.max !== null;

  if (!hasMin && !hasMax) {
    return "Any value";
  }

  if (hasMin && hasMax) {
    return `${rangeValue.min} - ${rangeValue.max}`;
  }

  if (hasMin) {
    return `From ${rangeValue.min}`;
  }

  return `Up to ${rangeValue.max}`;
}
