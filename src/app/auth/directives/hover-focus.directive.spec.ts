import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HoverFocusDirective } from './hover-focus.directive';

@Component({
    template: `<input type="text" hoverfocus>`
})
class TestHoverFocusComponent {
}


describe('Directive: HoverFocus', () => {

    let component: TestHoverFocusComponent;
    let fixture: ComponentFixture<TestHoverFocusComponent>;
    let inputEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [TestHoverFocusComponent, HoverFocusDirective]
        });
        fixture = TestBed.createComponent(TestHoverFocusComponent);
        component = fixture.componentInstance;
        inputEl = fixture.debugElement.query(By.css('input'));
    });

    it('focus over input', () => {
        inputEl.triggerEventHandler('focus', null);
        fixture.detectChanges();
        expect(inputEl.nativeElement.style.backgroundColor).toBe('rgb(128, 212, 255)'); // #80d4ff

        inputEl.triggerEventHandler('focusout', null);
        fixture.detectChanges();
        expect(inputEl.nativeElement.style.backgroundColor).toBe('');
    });
});
