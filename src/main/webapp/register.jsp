<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%-- Set the language and message bundle at the top of the page --%>
<fmt:setLocale value="${sessionScope.userLanguage}" />
<fmt:setBundle basename="messages" />

<div class="form-container">
    <h2><fmt:message key="register.title"/></h2>

    <form method="POST" action="AuthServlet?action=register">
        <div>
            <label for="fullName"><fmt:message key="label.fullname"/></label>
            <input type="text" id="fullName" name="fullName" required>
        </div>
        
        <div>
            <label for="username"><fmt:message key="label.username"/></label>
            <input type="text" id="username" name="username" required>
        </div>

        <div>
            <label for="password"><fmt:message key="label.password"/></label>
            <input type="password" id="password" name="password" required>
        </div>

        <div>
            <label for="confirmPassword"><fmt:message key="label.confirm_pass"/></label>
            <input type="password" id="confirmPassword" name="confirmPassword" required>
        </div>
        
        <div>
            <label for="contact"><fmt:message key="label.contact"/></label>
            <input type="tel" id="contact" name="contact" required>
        </div>

        <div>
            <label for="role"><fmt:message key="label.role"/></label>
            <select id="role" name="role">
                <option value="Vendor">Vendor</option>
                <option value="DeliveryPartner">Delivery Partner</option>
            </select>
        </div>
        
        <%-- This address field can be toggled with JavaScript based on role selection --%>
        <div id="address-field">
            <label for="address"><fmt:message key="label.address"/></label>
            <textarea id="address" name="address" rows="3"></textarea>
        </div>
        
        <button type="submit"><fmt:message key="button.register"/></button>
    </form>

    <p>
        <a href="login.jsp"><fmt:message key="link.already_have_account"/></a>
    </p>
</div>