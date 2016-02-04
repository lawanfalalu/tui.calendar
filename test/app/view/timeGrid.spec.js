/*eslint-disable*/
describe('View/TimeGrid', function() {
    var TimeGrid = ne.dooray.calendar.TimeGrid,
        proto;

    beforeEach(function() {
        proto = TimeGrid.prototype;
    });

    it('_getBaseViewModel()', function() {
        var MockDate = jasmine.createSpyObj('Date', ['getHours']);
        spyOn(window, 'Date').and.returnValue(MockDate);
        MockDate.getHours.and.returnValue(3);

        var expected = {
            hours: [3, 4, 5, 6, 7, 8, 9, 10],
            currentHour: 3
        };

        var obj = {
            options: {
                hourStart: 3,
                hourEnd: 11
            },
            _getHourmarkerViewModel: jasmine.createSpy('_getHourmarkerViewModel')
        };

        var result = proto._getBaseViewModel.call(obj);

        expect(result).toEqual(expected);
    });

    describe('_getTopPercentByTime()', function() {
        var originDate,
            mock;

        beforeEach(function() {
            mock = {
                _getGridSize: function() { return [200, 300]; },
                _getBaseViewModel: function() { return {hours: {length: 24}} },
                options: {
                    hourStart: 0,
                    hourEnd: 24 
                }
            };
        });

        it('calculate related CSS top pixel value by time object.', function() {
            // 12:00:00 is middle time of one days. return 50%
            expect(proto._getTopPercentByTime.call(mock, new Date('2015-05-05T12:00:00+09:00'))).toBe(50);
            expect(proto._getTopPercentByTime.call(mock, new Date('2015-05-05T00:00:00+09:00'))).toBe(0);

            mock.options.hourStart = 21;
            expect(proto._getTopPercentByTime.call(mock, new Date('2015-05-05T22:30:00+09:00'))).toBe(50);

            mock.options.hourStart = 21;
            expect(proto._getTopPercentByTime.call(mock, new Date('2015-05-05T22:30:00+09:00'))).toBe(50);
        });

        it('calculate properly when hourStart, hourEnd is changed.', function() {
            mock.options.hourStart = 9;
            mock.options.hourEnd = 14;
            mock._getBaseViewModel = function() { return {hours: {length: 5}}; };

            expect(proto._getTopPercentByTime.call(mock, new Date('2015-05-05T11:00:00+09:00'))).toBe(40);
        });
    });
});
